import ts from "typescript";
import { LogicError } from "../Error/Errors.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { UnionType } from "../Type/UnionType.js";
import { extractLiterals } from "../Utils/extractLiterals.js";
import { isExtendsType } from "../Utils/isExtendsType.js";
import { IntrinsicType } from "../Type/IntrinsicType.js";
import { StringType } from "../Type/StringType.js";

export const intrinsicMethods = {
    Uppercase: (v) => v.toUpperCase(),
    Lowercase: (v) => v.toLowerCase(),
    Capitalize: (v) => v[0].toUpperCase() + v.slice(1),
    Uncapitalize: (v) => v[0].toLowerCase() + v.slice(1),
} as const satisfies Record<string, ((v: string) => string) | undefined>;

function isIntrinsicMethod(methodName: string): methodName is keyof typeof intrinsicMethods {
    return methodName in intrinsicMethods;
}

export class IntrinsicNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntrinsicKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        const methodName = getParentName(node);
        if (!isIntrinsicMethod(methodName)) {
            throw new LogicError(node, `Unknown intrinsic method: ${methodName}`);
        }

        const method = intrinsicMethods[methodName];
        const argument = context.getArguments()[0];

        try {
            const literals = extractLiterals(argument)
                .map(method)
                .map((literal) => new LiteralType(literal));

            if (literals.length === 1) {
                return literals[0];
            }

            return new UnionType(literals);
        } catch (error) {
            if (isExtendsType(context.getReference())) {
                return new IntrinsicType(method, argument);
            }

            return new StringType();
        }
    }
}

function getParentName(node: ts.KeywordTypeNode): string {
    const parent = node.parent;

    if (!ts.isTypeAliasDeclaration(parent)) {
        throw new LogicError(node, "Only intrinsics part of a TypeAliasDeclaration are supported.");
    }

    return parent.name.text;
}
