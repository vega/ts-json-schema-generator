"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NumberType_1 = require("../Type/NumberType");
class NumberTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.NumberKeyword;
    }
    createType(node, context) {
        return new NumberType_1.NumberType();
    }
}
exports.NumberTypeNodeParser = NumberTypeNodeParser;
//# sourceMappingURL=NumberTypeNodeParser.js.map