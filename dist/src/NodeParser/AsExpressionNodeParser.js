"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsExpressionNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
class AsExpressionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.AsExpression;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.expression, context);
    }
}
exports.AsExpressionNodeParser = AsExpressionNodeParser;
//# sourceMappingURL=AsExpressionNodeParser.js.map