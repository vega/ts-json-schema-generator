"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LiteralType_1 = require("../Type/LiteralType");
class StringLiteralNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.StringLiteral;
    }
    createType(node, context) {
        return new LiteralType_1.LiteralType(node.text);
    }
}
exports.StringLiteralNodeParser = StringLiteralNodeParser;
//# sourceMappingURL=StringLiteralNodeParser.js.map