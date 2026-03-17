"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const LiteralType_js_1 = require("../Type/LiteralType.js");
class StringLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.StringLiteral;
    }
    createType(node, context) {
        return new LiteralType_js_1.LiteralType(node.text);
    }
}
exports.StringLiteralNodeParser = StringLiteralNodeParser;
//# sourceMappingURL=StringLiteralNodeParser.js.map