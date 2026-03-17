import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { SymbolType } from "../Type/SymbolType.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class SymbolTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: SymbolType): Definition;
    getChildren(type: SymbolType): BaseType[];
}
