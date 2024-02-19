"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NumberType_1 = require("../Type/NumberType");
class NumberTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NumberKeyword || node.kind === typescript_1.default.SyntaxKind.BigIntKeyword;
    }
    createType(node, context) {
        return new NumberType_1.NumberType();
    }
}
exports.NumberTypeNodeParser = NumberTypeNodeParser;
//# sourceMappingURL=NumberTypeNodeParser.js.map