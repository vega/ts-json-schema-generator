"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsExpressionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
class AsExpressionNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.AsExpression;
    }
    createType(node, context) {
        // only implement `as const` for now where we just ignore the as expression
        return this.childNodeParser.createType(node.expression, context);
    }
}
exports.AsExpressionNodeParser = AsExpressionNodeParser;
//# sourceMappingURL=AsExpressionNodeParser.js.map