import ts from "typescript";
import { UnknownTypeError } from "../Error/UnknownTypeError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { UnionType } from "../Type/UnionType";

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
        const prefix = node.head.text;
        const matrix: string[][] = [[prefix]].concat(
            node.templateSpans.map((span) => {
                const suffix = span.literal.text;
                const type = this.childNodeParser.createType(span.type, context);
                return [...extractLiterals(type)].map((value) => value + suffix);
            })
        );

        const expandedLiterals = expand(matrix);

        const expandedTypes = expandedLiterals.map((literal) => new LiteralType(literal));

        if (expandedTypes.length === 1) {
            return expandedTypes[0];
        }

        return new UnionType(expandedTypes);
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

function* extractLiterals(type: BaseType | undefined): Iterable<string> {
    if (!type) return;
    if (type instanceof LiteralType) {
        yield type.getValue().toString();
        return;
    }
    if (type instanceof UnionType) {
        for (const t of type.getTypes()) {
            yield* extractLiterals(t);
        }
        return;
    }
    if (type instanceof AliasType) {
        yield* extractLiterals(type.getType());
        return;
    }

    throw new UnknownTypeError(type);
}
