import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AnyType } from "../Type/AnyType.js";
import type { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NumberType } from "../Type/NumberType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { AliasType } from "../Type/AliasType.js";

export class BinaryExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.BinaryExpression;
    }

    public createType(node: ts.BinaryExpression, context: Context): BaseType {
        const leftType = this.childNodeParser.createType(node.left, context);
        const rightType = this.childNodeParser.createType(node.right, context);

        if (leftType instanceof AnyType || rightType instanceof AnyType) {
            return new AnyType();
        }

        if (this.isStringLike(leftType) || this.isStringLike(rightType)) {
            return new StringType();
        }

        if (this.isDefinitelyNumberLike(leftType) && this.isDefinitelyNumberLike(rightType)) {
            return new NumberType();
        }

        if (this.isBooleanLike(leftType) && this.isBooleanLike(rightType)) {
            return new BooleanType();
        }

        // Anything else (objects, any, unknown, weird unions, etc.) return
        // 'string' because at runtime + will usually go through ToPrimitive and
        // end up in the "string concatenation" branch when non-numeric stuff is
        // involved.
        return new StringType();
    }

    private isStringLike(type: BaseType): boolean {
        if (type instanceof AliasType) {
            return this.isStringLike(type.getType());
        }

        if (type instanceof StringType) {
            return true;
        }

        if (type instanceof LiteralType && type.isString()) {
            return true;
        }

        // Any union member being string-like is enough.
        if (type instanceof UnionType) {
            return type.getTypes().some((t) => this.isStringLike(t));
        }

        return false;
    }

    private isBooleanLike(type: BaseType): boolean {
        if (type instanceof BooleanType) {
            return true;
        }

        if (type instanceof LiteralType && typeof type.getValue() === "boolean") {
            return true;
        }

        return false;
    }

    private isDefinitelyNumberLike(type: BaseType): boolean {
        if (type instanceof AliasType) {
            return this.isDefinitelyNumberLike(type.getType());
        }

        if (type instanceof NumberType) {
            return true;
        }

        if (type instanceof LiteralType && typeof type.getValue() === "number") {
            return true;
        }

        if (type instanceof UnionType) {
            return type.getTypes().every((t) => this.isDefinitelyNumberLike(t));
        }

        return false;
    }
}
