import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AnyType } from "../Type/AnyType.js";
import type { BaseType } from "../Type/BaseType.js";

export class AnyTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.AnyKeyword || node.kind === ts.SyntaxKind.SymbolKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new AnyType();
    }
}
