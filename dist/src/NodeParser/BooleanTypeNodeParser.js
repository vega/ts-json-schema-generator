"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const BooleanType_js_1 = require("../Type/BooleanType.js");
class BooleanTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.BooleanKeyword;
    }
    createType(node, context) {
        return new BooleanType_js_1.BooleanType();
    }
}
exports.BooleanTypeNodeParser = BooleanTypeNodeParser;
//# sourceMappingURL=BooleanTypeNodeParser.js.map