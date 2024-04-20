import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { SymbolType } from "../Type/SymbolType.js";
import { BaseType } from "../Type/BaseType.js";

export class SymbolTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof SymbolType;
    }
    public getDefinition(type: SymbolType): Definition {
        return {};
    }
    public getChildren(type: SymbolType): BaseType[] {
        return [];
    }
}
