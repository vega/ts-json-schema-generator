"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedTupleMemberNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const AnnotatedType_1 = require("../Type/AnnotatedType");
const ArrayType_1 = require("../Type/ArrayType");
const RestType_1 = require("../Type/RestType");
class NamedTupleMemberNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NamedTupleMember;
    }
    createType(node, context, reference) {
        const baseType = this.childNodeParser.createType(node.type, context, reference);
        if (baseType instanceof ArrayType_1.ArrayType && node.getChildAt(0).kind === typescript_1.default.SyntaxKind.DotDotDotToken) {
            return new RestType_1.RestType(baseType, node.name.text);
        }
        return baseType && new AnnotatedType_1.AnnotatedType(baseType, { title: node.name.text }, false);
    }
}
exports.NamedTupleMemberNodeParser = NamedTupleMemberNodeParser;
//# sourceMappingURL=NamedTupleMemberNodeParser.js.map