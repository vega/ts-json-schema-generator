import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { SymbolType } from "../Type/SymbolType";

export class SymbolTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.SymbolKeyword;
    }

    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new SymbolType();
    }
}
