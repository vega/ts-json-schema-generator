"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LiteralType_1 = require("../Type/LiteralType");
class NumberLiteralNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.NumericLiteral;
    }
    createType(node, context) {
        return new LiteralType_1.LiteralType(parseFloat(node.text));
    }
}
exports.NumberLiteralNodeParser = NumberLiteralNodeParser;
//# sourceMappingURL=NumberLiteralNodeParser.js.map