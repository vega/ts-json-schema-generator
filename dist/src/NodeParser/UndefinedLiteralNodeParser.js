"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NullType_js_1 = require("../Type/NullType.js");
class UndefinedLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new NullType_js_1.NullType();
    }
}
exports.UndefinedLiteralNodeParser = UndefinedLiteralNodeParser;
//# sourceMappingURL=UndefinedLiteralNodeParser.js.map