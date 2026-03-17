import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownType } from "../Type/UnknownType.js";
export declare class UnknownTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: UnknownType): Definition;
    getChildren(): BaseType[];
}
