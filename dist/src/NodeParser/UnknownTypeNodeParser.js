"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const UnknownType_1 = require("../Type/UnknownType");
class UnknownTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UnknownKeyword;
    }
    createType(node, context) {
        return new UnknownType_1.UnknownType();
    }
}
exports.UnknownTypeNodeParser = UnknownTypeNodeParser;
//# sourceMappingURL=UnknownTypeNodeParser.js.map