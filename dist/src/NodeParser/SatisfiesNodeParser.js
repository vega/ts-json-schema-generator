"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SatisfiesNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
class SatisfiesNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.SatisfiesExpression;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.expression, context);
    }
}
exports.SatisfiesNodeParser = SatisfiesNodeParser;
//# sourceMappingURL=SatisfiesNodeParser.js.map