import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AnyType } from "../Type/AnyType.js";
import type { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";
import { StringType } from "../Type/StringType.js";
import { BooleanType } from "../Type/BooleanType.js";

export class BinaryExpressionNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.BinaryExpression;
    }

    public createType(node: ts.BinaryExpression, context: Context): BaseType {
        // For the purposes of types, assume that binary expressions always
        // evaluate to a number.
        const leftType = this.typeChecker.getTypeAtLocation(node.left);
        const rightType = this.typeChecker.getTypeAtLocation(node.right);

        if (this.isAny(leftType) || this.isAny(rightType)) {
            return new AnyType();
        }

        // 1) If either side is string-like → 'string'
        if (this.isStringLike(leftType) || this.isStringLike(rightType)) {
            return new StringType();
        }

        debugger;

        // 2) If both sides are definitely number-like → 'number'
        if (this.isDefinitelyNumberLike(leftType) && this.isDefinitelyNumberLike(rightType)) {
            console.log(`XXX in numbertype`);
            return new NumberType();
        }

        if (this.isBoolean(leftType) && this.isBoolean(rightType)) {
            return new BooleanType();
        }

        console.log(`XXX at fallthrough`);

        // 3) Anything else (objects, any, unknown, weird unions, etc.) →
        // 'string' because at runtime + will usually go through ToPrimitive and end
        // up in the "string concatenation" branch when non-numeric stuff is
        // involved.
        return new StringType();
    }

    private isAny(type: ts.Type): boolean {
        return (type.flags & ts.TypeFlags.Any) !== 0;
    }

    private isStringLike(inType: ts.Type): boolean {
        // Use apparent type to collapse things like literal unions, etc.
        const type = this.typeChecker.getApparentType(inType);

        // Union? Any member being string-like is enough.
        if (type.isUnion()) {
            return type.types.some((t) => this.isStringLike(t));
        }

        // String primitives + string literals + template literals
        if (type.flags & ts.TypeFlags.StringLike) {
            return true;
        }

        // Optionally treat String object type as string-like:
        const symbol = type.getSymbol();
        if (symbol && symbol.getName() === "String") {
            return true;
        }

        return false;
    }

    private isBoolean(inType: ts.Type): boolean {
        const type = this.typeChecker.getApparentType(inType);

        // Union? Any member being string-like is enough.
        if (type.isUnion()) {
            return type.types.some((t) => this.isStringLike(t));
        }

        // String primitives + string literals + template literals
        if (type.flags & ts.TypeFlags.BooleanLike) {
            return true;
        }

        // Optionally treat String object type as string-like:
        const symbol = type.getSymbol();
        if (symbol && symbol.getName() === "Boolean") {
            return true;
        }

        return false;
    }

    private isDefinitelyNumberLike(inType: ts.Type): boolean {
        debugger;
        // Again, use apparent type for unions/intersections
        const type = this.typeChecker.getApparentType(inType);

        const typeStr = this.typeChecker.typeToString(type);
        if (typeStr === "Number") {
            return true;
        }
        // console.log(`XXX type`, type);
        console.log(
            `XXX this.typeChecker.typeToString(type),
        `,
            this.typeChecker.typeToString(type),
        );

        if (type.isUnion()) {
            console.log(`XXX in in union`);
            // Must be number-like for *all* members to be "definitely number-like"
            return type.types.every((t) => this.isDefinitelyNumberLike(t));
        }

        console.log(`XXX getTypeFlagNames(type)`, getTypeFlagNames(type));

        // Number, number literal, enums, bigint etc.
        const numericFlags =
            ts.TypeFlags.Number |
            ts.TypeFlags.NumberLiteral |
            ts.TypeFlags.NumberLike |
            ts.TypeFlags.BigIntLike |
            ts.TypeFlags.EnumLike;

        console.log(`XXX type.flags`, type.flags, numericFlags);

        if (type.flags & numericFlags) {
            return true;
        }

        return false;
    }
}

function getTypeFlagNames(type: ts.Type): string[] {
    const flags = type.flags;
    const names: string[] = [];

    for (const key of Object.keys(ts.TypeFlags)) {
        // filter out the numeric reverse-mapping entries
        if (!Number.isNaN(Number(key))) continue;

        const flagValue = (ts.TypeFlags as any)[key] as number;
        if ((flags & flagValue) !== 0) {
            names.push(key);
        }
    }

    return names;
}
