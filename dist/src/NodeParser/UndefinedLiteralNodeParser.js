"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedLiteralNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NullType_1 = require("../Type/NullType");
class UndefinedLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new NullType_1.NullType();
    }
}
exports.UndefinedLiteralNodeParser = UndefinedLiteralNodeParser;
//# sourceMappingURL=UndefinedLiteralNodeParser.js.map