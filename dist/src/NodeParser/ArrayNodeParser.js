"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ArrayType_1 = require("../Type/ArrayType");
class ArrayNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ArrayType;
    }
    createType(node, context) {
        return new ArrayType_1.ArrayType(this.childNodeParser.createType(node.elementType, context));
    }
}
exports.ArrayNodeParser = ArrayNodeParser;
//# sourceMappingURL=ArrayNodeParser.js.map