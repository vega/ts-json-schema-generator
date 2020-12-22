import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { SymbolType } from "../Type/SymbolType";
import { BaseType } from "../Type/BaseType";

export class SymbolTypeFormatter implements SubTypeFormatter {
    public supportsType(type: SymbolType): boolean {
        return type instanceof SymbolType;
    }
    public getDefinition(type: SymbolType): Definition {
        return {};
    }
    public getChildren(type: SymbolType): BaseType[] {
        return [];
    }
}
