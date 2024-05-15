import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { AnyType } from "../Type/AnyType.js";
import { BaseType } from "../Type/BaseType.js";

export class AnyTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.AnyKeyword || node.kind === ts.SyntaxKind.SymbolKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new AnyType();
    }
}
