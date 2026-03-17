import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AnyType } from "../Type/AnyType.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class AnyTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: AnyType): Definition;
    getChildren(type: AnyType): BaseType[];
}
