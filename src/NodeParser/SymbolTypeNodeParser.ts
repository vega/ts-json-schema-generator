import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { SymbolType } from "../Type/SymbolType.js";

export class SymbolTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.SymbolKeyword;
    }

    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new SymbolType();
    }
}
