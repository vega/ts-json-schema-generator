"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const AnyType_js_1 = require("../Type/AnyType.js");
class AnyTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.AnyKeyword || node.kind === typescript_1.default.SyntaxKind.SymbolKeyword;
    }
    createType(node, context) {
        return new AnyType_js_1.AnyType();
    }
}
exports.AnyTypeNodeParser = AnyTypeNodeParser;
//# sourceMappingURL=AnyTypeNodeParser.js.map