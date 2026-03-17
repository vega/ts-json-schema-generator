import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { VoidType } from "../Type/VoidType.js";
export declare class VoidTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: VoidType): Definition;
    getChildren(type: VoidType): BaseType[];
}
