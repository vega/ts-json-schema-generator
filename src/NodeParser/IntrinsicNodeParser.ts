import ts from "typescript";
import { LogicError } from "../Error/Errors.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { UnionType } from "../Type/UnionType.js";
import { extractLiterals } from "../Utils/extractLiterals.js";

export const intrinsicMethods: Record<string, ((v: string) => string) | undefined> = {
    Uppercase: (v) => v.toUpperCase(),
    Lowercase: (v) => v.toLowerCase(),
    Capitalize: (v) => v[0].toUpperCase() + v.slice(1),
    Uncapitalize: (v) => v[0].toLowerCase() + v.slice(1),
};

export class IntrinsicNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntrinsicKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        const methodName = getParentName(node);
        const method = intrinsicMethods[methodName];

        if (!method) {
            throw new LogicError(node, `Unknown intrinsic method: ${methodName}`);
        }

        const literals = extractLiterals(context.getArguments()[0])
            .map(method)
            .map((literal) => new LiteralType(literal));
        if (literals.length === 1) {
            return literals[0];
        }
        return new UnionType(literals);
    }
}

function getParentName(node: ts.KeywordTypeNode): string {
    const parent = node.parent;

    if (!ts.isTypeAliasDeclaration(parent)) {
        throw new LogicError(node, "Only intrinsics part of a TypeAliasDeclaration are supported.");
    }

    return parent.name.text;
}
