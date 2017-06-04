import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
export declare class ArrayTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: ArrayType): boolean;
    getDefinition(type: ArrayType): Definition;
    getChildren(type: ArrayType): BaseType[];
}
