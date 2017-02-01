import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ReferenceType } from "../Type/ReferenceType";
import { DefinitionType } from "../Type/DefinitionType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class ReferenceTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ReferenceType): boolean {
        return type instanceof ReferenceType;
    }
    public getDefinition(type: ReferenceType): Definition {
        return {$ref: "#/definitions/" + type.getId()};
    }
    public getChildren(type: ReferenceType): BaseType[] {
        if (type.getType() instanceof DefinitionType) {
            return [];
        }

        // this means that the referred interface is private
        // so we have to expose it in the schema definitions
        return this.childTypeFormatter.getChildren(new DefinitionType(type.getId(), type.getType()));
    }
}
