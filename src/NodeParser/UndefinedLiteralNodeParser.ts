import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { NullType } from "../Type/NullType.js";

export class UndefinedLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NullType();
    }
}
