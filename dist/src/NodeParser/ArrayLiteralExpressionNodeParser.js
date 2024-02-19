"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLiteralExpressionNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const TupleType_1 = require("../Type/TupleType");
class ArrayLiteralExpressionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ArrayLiteralExpression;
    }
    createType(node, context) {
        const elements = node.elements.map((t) => this.childNodeParser.createType(t, context));
        return new TupleType_1.TupleType(elements);
    }
}
exports.ArrayLiteralExpressionNodeParser = ArrayLiteralExpressionNodeParser;
//# sourceMappingURL=ArrayLiteralExpressionNodeParser.js.map