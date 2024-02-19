import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { TypeFormatter } from "../TypeFormatter";
export declare class OptionalTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: OptionalType): boolean;
    getDefinition(type: OptionalType): Definition;
    getChildren(type: OptionalType): BaseType[];
}
