import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";

export class BooleanLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.BooleanLiteral): boolean {
        return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
    }
    public createType(node: ts.BooleanLiteral, context: Context): BaseType {
        return new LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
    }
}
