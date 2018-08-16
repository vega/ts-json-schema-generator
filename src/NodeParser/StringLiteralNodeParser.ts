import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";

export class StringLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.StringLiteral): boolean {
        return node.kind === ts.SyntaxKind.StringLiteral;
    }
    public createType(node: ts.StringLiteral, context: Context): BaseType {
        return new LiteralType(node.text);
    }
}
