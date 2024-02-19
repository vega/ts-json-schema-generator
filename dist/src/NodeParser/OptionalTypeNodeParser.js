"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const OptionalType_1 = require("../Type/OptionalType");
class OptionalTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.OptionalType;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.type, context);
        return new OptionalType_1.OptionalType(type);
    }
}
exports.OptionalTypeNodeParser = OptionalTypeNodeParser;
//# sourceMappingURL=OptionalTypeNodeParser.js.map