"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const LiteralType_js_1 = require("../Type/LiteralType.js");
class BooleanLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TrueKeyword || node.kind === typescript_1.default.SyntaxKind.FalseKeyword;
    }
    createType(node, context) {
        return new LiteralType_js_1.LiteralType(node.kind === typescript_1.default.SyntaxKind.TrueKeyword);
    }
}
exports.BooleanLiteralNodeParser = BooleanLiteralNodeParser;
//# sourceMappingURL=BooleanLiteralNodeParser.js.map