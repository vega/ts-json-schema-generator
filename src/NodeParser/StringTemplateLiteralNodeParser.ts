import ts from "typescript";
import { UnknownTypeError } from "../Error/UnknownTypeError.js";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { extractLiterals } from "../Utils/extractLiterals.js";

export class StringTemplateLiteralNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode): boolean {
        return (
            node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral || node.kind === ts.SyntaxKind.TemplateLiteralType
        );
    }
    public createType(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode, context: Context): BaseType {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return new LiteralType(node.text);
        }

        try {
            const prefix = node.head.text;
            const matrix: string[][] = [[prefix]].concat(
                node.templateSpans.map((span) => {
                    const suffix = span.literal.text;
                    const type = this.childNodeParser.createType(span.type, context);
                    return extractLiterals(type).map((value) => value + suffix);
                })
            );

            const expandedLiterals = expand(matrix);

            const expandedTypes = expandedLiterals.map((literal) => new LiteralType(literal));

            if (expandedTypes.length === 1) {
                return expandedTypes[0];
            }

            return new UnionType(expandedTypes);
        } catch (error) {
            if (error instanceof UnknownTypeError) {
                return new StringType();
            }

            throw error;
        }
    }
}

function expand(matrix: string[][]): string[] {
    if (matrix.length === 1) {
        return matrix[0];
    }
    const head = matrix[0];
    const nested = expand(matrix.slice(1));
    const combined = head.map((prefix) => nested.map((suffix) => prefix + suffix));
    return ([] as string[]).concat(...combined);
}
