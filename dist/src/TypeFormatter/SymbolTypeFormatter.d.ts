import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { SymbolType } from "../Type/SymbolType";
import { BaseType } from "../Type/BaseType";
export declare class SymbolTypeFormatter implements SubTypeFormatter {
    supportsType(type: SymbolType): boolean;
    getDefinition(type: SymbolType): Definition;
    getChildren(type: SymbolType): BaseType[];
}
