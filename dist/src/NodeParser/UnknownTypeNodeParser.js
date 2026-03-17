"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const UnknownType_js_1 = require("../Type/UnknownType.js");
class UnknownTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UnknownKeyword;
    }
    createType() {
        return new UnknownType_js_1.UnknownType(false);
    }
}
exports.UnknownTypeNodeParser = UnknownTypeNodeParser;
//# sourceMappingURL=UnknownTypeNodeParser.js.map