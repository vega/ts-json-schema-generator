"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
class ParameterParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.Parameter;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.type, context);
    }
}
exports.ParameterParser = ParameterParser;
//# sourceMappingURL=ParameterParser.js.map