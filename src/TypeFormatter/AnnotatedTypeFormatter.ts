import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";

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

    public supportsType(type: AnnotatedType): boolean {
        return type instanceof AnnotatedType;
    }
    public getDefinition(type: AnnotatedType): Definition {
        const annotations = type.getAnnotations();

        if ("$ref" in annotations) {
            return annotations;
        }

        const def: Definition = {
            ...this.childTypeFormatter.getDefinition(type.getType()),
            ...annotations,
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
