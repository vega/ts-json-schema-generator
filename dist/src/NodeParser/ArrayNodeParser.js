"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ArrayType_1 = require("../Type/ArrayType");
class ArrayNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ArrayType;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.elementType, context);
        return new ArrayType_1.ArrayType(type);
    }
}
exports.ArrayNodeParser = ArrayNodeParser;
//# sourceMappingURL=ArrayNodeParser.js.map