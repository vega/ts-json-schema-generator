import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { AnnotatedType } from "../Type/AnnotatedType";
import { Definition } from "../Schema/Definition";

export class AnnotatedTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: AnnotatedType): boolean {
        return type instanceof AnnotatedType;
    }
    public getDefinition(type: AnnotatedType): Definition {
        return {
            ...this.childTypeFormatter.getDefinition(type.getType()),
            ...type.getAnnotations(),
        };
    }
    public getChildren(type: AnnotatedType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
