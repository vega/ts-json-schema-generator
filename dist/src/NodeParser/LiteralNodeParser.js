"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
class LiteralNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.LiteralType;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.literal, context);
    }
}
exports.LiteralNodeParser = LiteralNodeParser;
//# sourceMappingURL=LiteralNodeParser.js.map