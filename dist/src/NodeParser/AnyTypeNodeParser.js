"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const AnyType_1 = require("../Type/AnyType");
class AnyTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.AnyKeyword || node.kind === typescript_1.default.SyntaxKind.SymbolKeyword;
    }
    createType(node, context) {
        return new AnyType_1.AnyType();
    }
}
exports.AnyTypeNodeParser = AnyTypeNodeParser;
//# sourceMappingURL=AnyTypeNodeParser.js.map