import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";

export class StringLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.StringLiteral): boolean {
        return node.kind === ts.SyntaxKind.StringLiteral;
    }
    public createType(node: ts.StringLiteral, context: Context): BaseType {
        return new LiteralType(node.text);
    }
}
