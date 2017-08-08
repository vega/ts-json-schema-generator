"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const AnyType_1 = require("../Type/AnyType");
class AnyTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.AnyKeyword;
    }
    createType(node, context) {
        return new AnyType_1.AnyType();
    }
}
exports.AnyTypeNodeParser = AnyTypeNodeParser;
//# sourceMappingURL=AnyTypeNodeParser.js.map