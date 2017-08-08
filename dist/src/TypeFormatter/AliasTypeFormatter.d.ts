import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
export declare class AliasTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: AliasType): boolean;
    getDefinition(type: AliasType): Definition;
    getChildren(type: AliasType): BaseType[];
}
