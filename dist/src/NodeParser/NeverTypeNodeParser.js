"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeverTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NeverType_1 = require("../Type/NeverType");
class NeverTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NeverKeyword;
    }
    createType(_node, _context) {
        return new NeverType_1.NeverType();
    }
}
exports.NeverTypeNodeParser = NeverTypeNodeParser;
//# sourceMappingURL=NeverTypeNodeParser.js.map