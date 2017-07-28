"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class ParenthesizedNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ParenthesizedType;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.type, context);
    }
}
exports.ParenthesizedNodeParser = ParenthesizedNodeParser;
//# sourceMappingURL=ParenthesizedNodeParser.js.map