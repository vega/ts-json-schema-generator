import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { TypeFormatter } from "../TypeFormatter.js";

export class ReferenceTypeFormatter implements SubTypeFormatter {
    public constructor(
        protected childTypeFormatter: TypeFormatter,
        protected encodeRefs: boolean,
    ) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof ReferenceType;
    }
    public getDefinition(type: ReferenceType): Definition {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    public getChildren(type: ReferenceType): BaseType[] {
        const referredType = type.getType();
        if (referredType instanceof DefinitionType) {
            // We probably already have the definitions for the children created so we could return `[]`.
            // There are cases where we may not have (in particular intersections of unions with recursion).
            // To make sure we create the necessary definitions, we return the children of the referred type here.
            // Because we cache definitions, this should not incur any performance impact.
            return this.childTypeFormatter.getChildren(referredType);
        }

        // this means that the referred interface is protected
        // so we have to expose it in the schema definitions
        return this.childTypeFormatter.getChildren(new DefinitionType(type.getName(), type.getType()));
    }
}
