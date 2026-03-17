"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
class UndefinedTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new UndefinedType_js_1.UndefinedType();
    }
}
exports.UndefinedTypeNodeParser = UndefinedTypeNodeParser;
//# sourceMappingURL=UndefinedTypeNodeParser.js.map