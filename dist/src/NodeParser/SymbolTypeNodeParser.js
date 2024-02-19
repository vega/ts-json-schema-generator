"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const SymbolType_1 = require("../Type/SymbolType");
class SymbolTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.SymbolKeyword;
    }
    createType(node, context) {
        return new SymbolType_1.SymbolType();
    }
}
exports.SymbolTypeNodeParser = SymbolTypeNodeParser;
//# sourceMappingURL=SymbolTypeNodeParser.js.map