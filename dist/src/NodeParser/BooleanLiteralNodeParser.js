"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LiteralType_1 = require("../Type/LiteralType");
class BooleanLiteralNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
    }
    createType(node, context) {
        return new LiteralType_1.LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
    }
}
exports.BooleanLiteralNodeParser = BooleanLiteralNodeParser;
//# sourceMappingURL=BooleanLiteralNodeParser.js.map