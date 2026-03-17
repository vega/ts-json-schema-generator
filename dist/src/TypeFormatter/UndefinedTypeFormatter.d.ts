import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { UndefinedType } from "../Type/UndefinedType.js";
export declare class UndefinedTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: UndefinedType): Definition;
    getChildren(type: UndefinedType): BaseType[];
}
