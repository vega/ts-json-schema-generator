import { isArray } from "util";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export function makeNullable(def: Definition) {
    const union: Definition[] | undefined = def.oneOf || def.anyOf;
    if (union && union.filter((d: Definition) => d.type === "null").length === 0) {
        union.push({ type: "null" });
    } else if (def.type && def.type !== "object") {
        if (isArray(def.type)) {
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
            for (const d of def.anyOf!) {
                if (d.type === "null") {
                    return def;
                }
            }
        }

        for (const k in def) {
            if (def.hasOwnProperty(k) && k !== "description" && k !== "title" && k !== "default") {
                const key: keyof Definition = k as keyof Definition;
                subdef[key] = def[key];
                delete def[key];
            }
        }
        def.anyOf = [ subdef, { type: "null" } ];
    }
    return def;
}

export class AnnotatedTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: AnnotatedType): boolean {
        return type instanceof AnnotatedType;
    }
    public getDefinition(type: AnnotatedType): Definition {
        const def: Definition = {
            ...this.childTypeFormatter.getDefinition(type.getType()),
            ...type.getAnnotations(),
        };

        if (type.isNullable()) {
            return makeNullable(def);
        }

        return  def;
    }
    public getChildren(type: AnnotatedType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
