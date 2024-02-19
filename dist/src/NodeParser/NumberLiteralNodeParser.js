"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberLiteralNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralType_1 = require("../Type/LiteralType");
class NumberLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NumericLiteral;
    }
    createType(node, context) {
        return new LiteralType_1.LiteralType(parseFloat(node.text));
    }
}
exports.NumberLiteralNodeParser = NumberLiteralNodeParser;
//# sourceMappingURL=NumberLiteralNodeParser.js.map