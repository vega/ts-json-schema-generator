"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const AnyType_js_1 = require("../Type/AnyType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
class ArrayNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ArrayType;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.elementType, context);
        // Generics without `extends` or `defaults` cannot be resolved, so we fallback to `any`
        return new ArrayType_js_1.ArrayType(type ?? new AnyType_js_1.AnyType());
    }
}
exports.ArrayNodeParser = ArrayNodeParser;
//# sourceMappingURL=ArrayNodeParser.js.map