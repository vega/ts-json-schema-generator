"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const VoidType_1 = require("../Type/VoidType");
class VoidTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.VoidKeyword;
    }
    createType(node, context) {
        return new VoidType_1.VoidType();
    }
}
exports.VoidTypeNodeParser = VoidTypeNodeParser;
//# sourceMappingURL=VoidTypeNodeParser.js.map