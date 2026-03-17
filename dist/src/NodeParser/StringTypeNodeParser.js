"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const StringType_js_1 = require("../Type/StringType.js");
class StringTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.StringKeyword;
    }
    createType(node, context) {
        return new StringType_js_1.StringType();
    }
}
exports.StringTypeNodeParser = StringTypeNodeParser;
//# sourceMappingURL=StringTypeNodeParser.js.map