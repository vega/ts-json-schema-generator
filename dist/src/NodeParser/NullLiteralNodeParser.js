"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullLiteralNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NullType_1 = require("../Type/NullType");
class NullLiteralNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NullKeyword;
    }
    createType(node, context) {
        return new NullType_1.NullType();
    }
}
exports.NullLiteralNodeParser = NullLiteralNodeParser;
//# sourceMappingURL=NullLiteralNodeParser.js.map