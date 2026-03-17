"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedTupleMemberNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
const RestType_js_1 = require("../Type/RestType.js");
class NamedTupleMemberNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NamedTupleMember;
    }
    createType(node, context, reference) {
        const baseType = this.childNodeParser.createType(node.type, context, reference);
        if (baseType instanceof ArrayType_js_1.ArrayType && node.getChildAt(0).kind === typescript_1.default.SyntaxKind.DotDotDotToken) {
            return new RestType_js_1.RestType(baseType, node.name.text);
        }
        return baseType && new AnnotatedType_js_1.AnnotatedType(baseType, { title: node.name.text }, false);
    }
}
exports.NamedTupleMemberNodeParser = NamedTupleMemberNodeParser;
//# sourceMappingURL=NamedTupleMemberNodeParser.js.map