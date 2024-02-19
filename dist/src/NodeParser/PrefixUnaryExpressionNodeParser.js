"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixUnaryExpressionNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralType_1 = require("../Type/LiteralType");
class PrefixUnaryExpressionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.PrefixUnaryExpression;
    }
    createType(node, context) {
        const operand = this.childNodeParser.createType(node.operand, context);
        if (operand instanceof LiteralType_1.LiteralType) {
            switch (node.operator) {
                case typescript_1.default.SyntaxKind.PlusToken:
                    return new LiteralType_1.LiteralType(+operand.getValue());
                case typescript_1.default.SyntaxKind.MinusToken:
                    return new LiteralType_1.LiteralType(-operand.getValue());
                case typescript_1.default.SyntaxKind.TildeToken:
                    return new LiteralType_1.LiteralType(~operand.getValue());
                case typescript_1.default.SyntaxKind.ExclamationToken:
                    return new LiteralType_1.LiteralType(!operand.getValue());
                default:
                    throw new Error(`Unsupported prefix unary operator: ${node.operator}`);
            }
        }
        else {
            throw new Error(`Expected operand to be "LiteralType" but is "${operand ? operand.constructor.name : operand}"`);
        }
    }
}
exports.PrefixUnaryExpressionNodeParser = PrefixUnaryExpressionNodeParser;
//# sourceMappingURL=PrefixUnaryExpressionNodeParser.js.map