"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const RestType_1 = require("../Type/RestType");
class RestTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.RestType;
    }
    createType(node, context) {
        return new RestType_1.RestType(this.childNodeParser.createType(node.type, context));
    }
}
exports.RestTypeNodeParser = RestTypeNodeParser;
//# sourceMappingURL=RestTypeNodeParser.js.map