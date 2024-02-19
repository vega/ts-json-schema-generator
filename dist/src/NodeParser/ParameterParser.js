"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
class ParameterParser {
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