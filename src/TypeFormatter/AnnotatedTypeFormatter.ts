import { JsonTypeError } from "../Error/Errors.js";
import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
import { derefType } from "../Utils/derefType.js";

export function makeNullable(def: Definition): Definition {
    const union: Definition[] | undefined = (def.oneOf as Definition[]) || def.anyOf;
    if (union && union.filter((d: Definition) => d.type === "null").length === 0) {
        union.push({ type: "null" });
    } else if (def.type && def.type !== "object") {
        if (Array.isArray(def.type)) {
            if (def.type.indexOf("null") === -1) {
                def.type.push("null");
            }
        } else if (def.type !== "null") {
            def.type = [def.type, "null"];
        }

        // enums need null as an option
        if (def.enum && def.enum.indexOf(null) === -1) {
            def.enum.push(null);
        }
    } else {
        const subdef: Definition = {};

        if ("anyOf" in def) {
            for (const d of def.anyOf as Definition[]) {
                if (d.type === "null") {
                    return def;
                }
            }
        }

        for (const key of Object.keys(def) as (keyof Definition)[]) {
            if (key !== "description" && key !== "title" && key !== "default") {
                (subdef as any)[key] = def[key] as any;
                delete def[key];
            }
        }
        def.anyOf = [subdef, { type: "null" }];
    }
    return def;
}

export class AnnotatedTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof AnnotatedType;
    }
    public getDefinition(type: AnnotatedType): Definition {
        const annotations = type.getAnnotations();

        if ("discriminator" in annotations) {
            const deref = derefType(type.getType());
            if (deref instanceof UnionType) {
                deref.setDiscriminator(annotations.discriminator);
                delete annotations.discriminator;
            } else {
                throw new JsonTypeError(
                    `Cannot assign discriminator tag to type: ${deref.getName()}. This tag can only be assigned to union types.`,
                    deref,
                );
            }
        }

        const def: Definition = {
            ...this.childTypeFormatter.getDefinition(type.getType()),
            ...type.getAnnotations(),
        };

        if ("$ref" in def && "type" in def) {
            delete def["$ref"];
        }

        if (type.isNullable()) {
            return makeNullable(def);
        }

        return def;
    }
    public getChildren(type: AnnotatedType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
