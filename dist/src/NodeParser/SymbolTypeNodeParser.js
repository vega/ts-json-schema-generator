"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const SymbolType_js_1 = require("../Type/SymbolType.js");
class SymbolTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.SymbolKeyword;
    }
    createType(node, context) {
        return new SymbolType_js_1.SymbolType();
    }
}
exports.SymbolTypeNodeParser = SymbolTypeNodeParser;
//# sourceMappingURL=SymbolTypeNodeParser.js.map