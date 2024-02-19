"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const BooleanType_1 = require("../Type/BooleanType");
class BooleanTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.BooleanKeyword;
    }
    createType(node, context) {
        return new BooleanType_1.BooleanType();
    }
}
exports.BooleanTypeNodeParser = BooleanTypeNodeParser;
//# sourceMappingURL=BooleanTypeNodeParser.js.map