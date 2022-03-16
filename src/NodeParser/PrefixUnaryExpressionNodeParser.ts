import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";

export class PrefixUnaryExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.PrefixUnaryExpression): boolean {
        return node.kind === ts.SyntaxKind.PrefixUnaryExpression;
    }

    public createType(node: ts.PrefixUnaryExpression, context: Context): BaseType {
        const operand = this.childNodeParser.createType(node.operand, context);
        if (operand instanceof LiteralType) {
            switch (node.operator) {
                case ts.SyntaxKind.PlusToken:
                    return new LiteralType(+operand.getValue());
                case ts.SyntaxKind.MinusToken:
                    return new LiteralType(-operand.getValue());
                case ts.SyntaxKind.TildeToken:
                    return new LiteralType(~operand.getValue());
                case ts.SyntaxKind.ExclamationToken:
                    return new LiteralType(!operand.getValue());
                default:
                    throw new Error(`Unsupported prefix unary operator: ${node.operator}`);
            }
        } else {
            throw new Error(
                `Expected operand to be "LiteralType" but is "${operand ? operand.constructor.name : operand}"`
            );
        }
    }
}
