import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { NullType } from "../Type/NullType.js";

export class UndefinedLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NullType();
    }
}
