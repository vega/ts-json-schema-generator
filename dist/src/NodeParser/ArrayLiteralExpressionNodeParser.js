"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLiteralExpressionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const TupleType_js_1 = require("../Type/TupleType.js");
class ArrayLiteralExpressionNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ArrayLiteralExpression;
    }
    createType(node, context) {
        const elements = node.elements.map((t) => this.childNodeParser.createType(t, context));
        return new TupleType_js_1.TupleType(elements);
    }
}
exports.ArrayLiteralExpressionNodeParser = ArrayLiteralExpressionNodeParser;
//# sourceMappingURL=ArrayLiteralExpressionNodeParser.js.map