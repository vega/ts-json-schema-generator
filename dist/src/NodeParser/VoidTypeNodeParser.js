"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const VoidType_1 = require("../Type/VoidType");
class VoidTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    }
    createType(node, context) {
        return new VoidType_1.VoidType();
    }
}
exports.VoidTypeNodeParser = VoidTypeNodeParser;
//# sourceMappingURL=VoidTypeNodeParser.js.map