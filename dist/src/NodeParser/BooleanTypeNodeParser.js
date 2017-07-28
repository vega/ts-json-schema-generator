"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const BooleanType_1 = require("../Type/BooleanType");
class BooleanTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    }
    createType(node, context) {
        return new BooleanType_1.BooleanType();
    }
}
exports.BooleanTypeNodeParser = BooleanTypeNodeParser;
//# sourceMappingURL=BooleanTypeNodeParser.js.map