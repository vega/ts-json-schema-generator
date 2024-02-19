"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const InferType_1 = require("../Type/InferType");
class InferTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.InferType;
    }
    createType(node, _context) {
        return new InferType_1.InferType(node.typeParameter.name.escapedText.toString());
    }
}
exports.InferTypeNodeParser = InferTypeNodeParser;
//# sourceMappingURL=InferTypeNodeParser.js.map