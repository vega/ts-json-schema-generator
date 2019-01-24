import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";

export class PrefixUnaryExpressionParser implements SubNodeParser {
    public supportsNode(node: ts.PrefixUnaryExpression): boolean {
        /**
         * Although syntactically "PrefixUnaryExpression" applies to the following structures:
         * +=123, -=123, --123, ++123, +'123', -'123', +123, -123
         *
         * This parser is only concern with  -123 since only these are allowed in interfaces and type definitions.
         */

        return node.kind === ts.SyntaxKind.PrefixUnaryExpression && node.operator == ts.SyntaxKind.MinusToken
    }
    public createType(node: ts.PrefixUnaryExpression, context: Context): BaseType {
        let operator = '-';
        //@ts-ignore
        return new LiteralType(parseFloat(operator + node.operand.text));
    }
}
