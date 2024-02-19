"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanLiteralNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralType_1 = require("../Type/LiteralType");
class BooleanLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TrueKeyword || node.kind === typescript_1.default.SyntaxKind.FalseKeyword;
    }
    createType(node, context) {
        return new LiteralType_1.LiteralType(node.kind === typescript_1.default.SyntaxKind.TrueKeyword);
    }
}
exports.BooleanLiteralNodeParser = BooleanLiteralNodeParser;
//# sourceMappingURL=BooleanLiteralNodeParser.js.map