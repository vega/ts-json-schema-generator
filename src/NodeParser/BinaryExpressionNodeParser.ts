import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";

export class BinaryExpressionNodeParser implements SubNodeParser {
    public supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.BinaryExpression;
    }
    public createType(node: ts.BinaryExpression, context: Context): BaseType {
        return new NumberType();
    }
}
