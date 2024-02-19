import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { RestType } from "../Type/RestType";
import { TypeFormatter } from "../TypeFormatter";
export declare class RestTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: RestType): Definition;
    getChildren(type: RestType): BaseType[];
}
