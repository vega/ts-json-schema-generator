"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const RestType_js_1 = require("../Type/RestType.js");
class RestTypeNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.RestType;
    }
    createType(node, context) {
        return new RestType_js_1.RestType(this.childNodeParser.createType(node.type, context));
    }
}
exports.RestTypeNodeParser = RestTypeNodeParser;
//# sourceMappingURL=RestTypeNodeParser.js.map