"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const OptionalType_js_1 = require("../Type/OptionalType.js");
class OptionalTypeNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.OptionalType;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.type, context);
        return new OptionalType_js_1.OptionalType(type);
    }
}
exports.OptionalTypeNodeParser = OptionalTypeNodeParser;
//# sourceMappingURL=OptionalTypeNodeParser.js.map