"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeverTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NeverType_js_1 = require("../Type/NeverType.js");
class NeverTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NeverKeyword;
    }
    createType(_node, _context) {
        return new NeverType_js_1.NeverType();
    }
}
exports.NeverTypeNodeParser = NeverTypeNodeParser;
//# sourceMappingURL=NeverTypeNodeParser.js.map