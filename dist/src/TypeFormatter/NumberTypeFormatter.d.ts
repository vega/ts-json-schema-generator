import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";
export declare class NumberTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: NumberType): Definition;
    getChildren(type: NumberType): BaseType[];
}
