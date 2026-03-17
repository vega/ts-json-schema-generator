"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const LiteralType_js_1 = require("../Type/LiteralType.js");
class NumberLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NumericLiteral;
    }
    createType(node, context) {
        return new LiteralType_js_1.LiteralType(parseFloat(node.text));
    }
}
exports.NumberLiteralNodeParser = NumberLiteralNodeParser;
//# sourceMappingURL=NumberLiteralNodeParser.js.map