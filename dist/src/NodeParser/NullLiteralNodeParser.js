"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NullType_js_1 = require("../Type/NullType.js");
class NullLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NullKeyword;
    }
    createType(node, context) {
        return new NullType_js_1.NullType();
    }
}
exports.NullLiteralNodeParser = NullLiteralNodeParser;
//# sourceMappingURL=NullLiteralNodeParser.js.map