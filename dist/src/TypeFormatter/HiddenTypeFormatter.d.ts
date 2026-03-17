import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { HiddenType } from "../Type/HiddenType.js";
export declare class HiddenTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: HiddenType): Definition;
    getChildren(type: HiddenType): BaseType[];
}
