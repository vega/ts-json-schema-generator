"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParenthesizedNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
class ParenthesizedNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ParenthesizedType;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.type, context);
    }
}
exports.ParenthesizedNodeParser = ParenthesizedNodeParser;
//# sourceMappingURL=ParenthesizedNodeParser.js.map