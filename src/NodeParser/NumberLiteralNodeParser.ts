import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";

export class NumberLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.NumericLiteral): boolean {
        return node.kind === ts.SyntaxKind.NumericLiteral;
    }
    public createType(node: ts.NumericLiteral, context: Context): BaseType {
        return new LiteralType(parseFloat(node.text));
    }
}
