import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { AnnotatedType } from "../Type/AnnotatedType";
import { Definition } from "../Schema/Definition";

function makeNullable(def: Definition) {
    const union: Definition[] | undefined = def.oneOf || def.anyOf;
    if (union && union.indexOf("null") ) {
        union.push({ type: "null" });
    } else {
        const type: string | string[] | undefined = def.type;
        delete def.type;
        def.anyOf = [{type}, { type: "null" }];
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
