import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";

export class BooleanLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.BooleanLiteral): boolean {
        return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
    }
    public createType(node: ts.BooleanLiteral, context: Context): BaseType {
        return new LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
    }
}
