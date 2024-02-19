"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const UndefinedType_1 = require("../Type/UndefinedType");
class UndefinedTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new UndefinedType_1.UndefinedType();
    }
}
exports.UndefinedTypeNodeParser = UndefinedTypeNodeParser;
//# sourceMappingURL=UndefinedTypeNodeParser.js.map