"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const StringType_1 = require("../Type/StringType");
class StringTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.StringKeyword;
    }
    createType(node, context) {
        return new StringType_1.StringType();
    }
}
exports.StringTypeNodeParser = StringTypeNodeParser;
//# sourceMappingURL=StringTypeNodeParser.js.map