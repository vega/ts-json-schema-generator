import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
export declare class LiteralTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: LiteralType): Definition;
    getChildren(type: LiteralType): BaseType[];
}
