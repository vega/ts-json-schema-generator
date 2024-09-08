import ts from "typescript";
import { ExpectationFailedError } from "../Error/Errors.js";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";

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
                    return new LiteralType(-(operand.getValue() as number));
                case ts.SyntaxKind.TildeToken:
                    return new LiteralType(~operand.getValue());
                case ts.SyntaxKind.ExclamationToken:
                    return new LiteralType(!operand.getValue());
            }

            throw new ExpectationFailedError("Unsupported prefix unary operator", node);
        }

        throw new ExpectationFailedError(
            `Expected operand to be "LiteralType" but is "${operand ? operand.constructor.name : operand}"`,
            node,
        );
    }
}
