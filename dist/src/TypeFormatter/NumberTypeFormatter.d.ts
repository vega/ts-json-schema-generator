import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NumberType } from "../Type/NumberType";
export declare class NumberTypeFormatter implements SubTypeFormatter {
    supportsType(type: NumberType): boolean;
    getDefinition(type: NumberType): Definition;
    getChildren(type: NumberType): BaseType[];
}
