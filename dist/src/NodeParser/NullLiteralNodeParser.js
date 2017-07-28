"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NullType_1 = require("../Type/NullType");
class NullLiteralNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.NullKeyword;
    }
    createType(node, context) {
        return new NullType_1.NullType();
    }
}
exports.NullLiteralNodeParser = NullLiteralNodeParser;
//# sourceMappingURL=NullLiteralNodeParser.js.map