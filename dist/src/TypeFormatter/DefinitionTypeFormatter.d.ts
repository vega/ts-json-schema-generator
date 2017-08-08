import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { TypeFormatter } from "../TypeFormatter";
export declare class DefinitionTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: DefinitionType): boolean;
    getDefinition(type: DefinitionType): Definition;
    getChildren(type: DefinitionType): BaseType[];
}
