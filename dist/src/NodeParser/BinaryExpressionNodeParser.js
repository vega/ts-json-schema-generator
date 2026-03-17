"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryExpressionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const AnyType_js_1 = require("../Type/AnyType.js");
const BooleanType_js_1 = require("../Type/BooleanType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const AliasType_js_1 = require("../Type/AliasType.js");
class BinaryExpressionNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.BinaryExpression;
    }
    createType(node, context) {
        const leftType = this.childNodeParser.createType(node.left, context);
        const rightType = this.childNodeParser.createType(node.right, context);
        if (leftType instanceof AnyType_js_1.AnyType || rightType instanceof AnyType_js_1.AnyType) {
            return new AnyType_js_1.AnyType();
        }
        if (this.isStringLike(leftType) || this.isStringLike(rightType)) {
            return new StringType_js_1.StringType();
        }
        if (this.isDefinitelyNumberLike(leftType) && this.isDefinitelyNumberLike(rightType)) {
            return new NumberType_js_1.NumberType();
        }
        if (this.isBooleanLike(leftType) && this.isBooleanLike(rightType)) {
            return new BooleanType_js_1.BooleanType();
        }
        // Anything else (objects, any, unknown, weird unions, etc.) return
        // 'string' because at runtime + will usually go through ToPrimitive and
        // end up in the "string concatenation" branch when non-numeric stuff is
        // involved.
        return new StringType_js_1.StringType();
    }
    isStringLike(type) {
        if (type instanceof AliasType_js_1.AliasType) {
            return this.isStringLike(type.getType());
        }
        if (type instanceof StringType_js_1.StringType) {
            return true;
        }
        if (type instanceof LiteralType_js_1.LiteralType && type.isString()) {
            return true;
        }
        // Any union member being string-like is enough.
        if (type instanceof UnionType_js_1.UnionType) {
            return type.getTypes().some((t) => this.isStringLike(t));
        }
        return false;
    }
    isBooleanLike(type) {
        if (type instanceof BooleanType_js_1.BooleanType) {
            return true;
        }
        if (type instanceof LiteralType_js_1.LiteralType && typeof type.getValue() === "boolean") {
            return true;
        }
        return false;
    }
    isDefinitelyNumberLike(type) {
        if (type instanceof AliasType_js_1.AliasType) {
            return this.isDefinitelyNumberLike(type.getType());
        }
        if (type instanceof NumberType_js_1.NumberType) {
            return true;
        }
        if (type instanceof LiteralType_js_1.LiteralType && typeof type.getValue() === "number") {
            return true;
        }
        if (type instanceof UnionType_js_1.UnionType) {
            return type.getTypes().every((t) => this.isDefinitelyNumberLike(t));
        }
        return false;
    }
}
exports.BinaryExpressionNodeParser = BinaryExpressionNodeParser;
//# sourceMappingURL=BinaryExpressionNodeParser.js.map