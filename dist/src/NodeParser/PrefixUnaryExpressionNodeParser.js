"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixUnaryExpressionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
class PrefixUnaryExpressionNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.PrefixUnaryExpression;
    }
    createType(node, context) {
        const operand = this.childNodeParser.createType(node.operand, context);
        if (operand instanceof LiteralType_js_1.LiteralType) {
            switch (node.operator) {
                case typescript_1.default.SyntaxKind.PlusToken:
                    return new LiteralType_js_1.LiteralType(+operand.getValue());
                case typescript_1.default.SyntaxKind.MinusToken:
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-unary-minus
                    return new LiteralType_js_1.LiteralType(-operand.getValue());
                case typescript_1.default.SyntaxKind.TildeToken:
                    return new LiteralType_js_1.LiteralType(~operand.getValue());
                case typescript_1.default.SyntaxKind.ExclamationToken:
                    return new LiteralType_js_1.LiteralType(!operand.getValue());
            }
            throw new Errors_js_1.ExpectationFailedError("Unsupported prefix unary operator", node);
        }
        throw new Errors_js_1.ExpectationFailedError(`Expected operand to be "LiteralType" but is "${operand ? operand.constructor.name : operand}"`, node);
    }
}
exports.PrefixUnaryExpressionNodeParser = PrefixUnaryExpressionNodeParser;
//# sourceMappingURL=PrefixUnaryExpressionNodeParser.js.map