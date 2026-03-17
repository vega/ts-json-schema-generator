"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const VoidType_js_1 = require("../Type/VoidType.js");
class VoidTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.VoidKeyword;
    }
    createType(node, context) {
        return new VoidType_js_1.VoidType();
    }
}
exports.VoidTypeNodeParser = VoidTypeNodeParser;
//# sourceMappingURL=VoidTypeNodeParser.js.map