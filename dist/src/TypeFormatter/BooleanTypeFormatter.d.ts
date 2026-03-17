import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";
export declare class BooleanTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: BooleanType): Definition;
    getChildren(type: BooleanType): BaseType[];
}
