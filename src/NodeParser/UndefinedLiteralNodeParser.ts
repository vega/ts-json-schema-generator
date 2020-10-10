import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";

export class UndefinedLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NullType();
    }
}
