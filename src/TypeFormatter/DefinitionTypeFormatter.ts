import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { TypeFormatter } from "../TypeFormatter";

export class DefinitionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: DefinitionType): boolean {
        return type instanceof DefinitionType;
    }
    public getDefinition(type: DefinitionType): Definition {
        return {$ref: "#/definitions/" + type.getId()};
    }
    public getChildren(type: DefinitionType): BaseType[] {
        return [
            type,
            ...this.childTypeFormatter.getChildren(type.getType()),
        ];
    }
}
