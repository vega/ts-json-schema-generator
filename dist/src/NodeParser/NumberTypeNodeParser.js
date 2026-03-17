"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NumberType_js_1 = require("../Type/NumberType.js");
class NumberTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NumberKeyword || node.kind === typescript_1.default.SyntaxKind.BigIntKeyword;
    }
    createType(node, context) {
        return new NumberType_js_1.NumberType();
    }
}
exports.NumberTypeNodeParser = NumberTypeNodeParser;
//# sourceMappingURL=NumberTypeNodeParser.js.map