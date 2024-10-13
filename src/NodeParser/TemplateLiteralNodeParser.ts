import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { TemplateLiteralType } from "../Type/TemplateLiteralType.js"; // New type
import { NeverType } from "../Type/NeverType.js";
import { extractLiterals } from "../Utils/extractLiterals.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { isExtendsType } from "../Utils/isExtendsType.js";

export class TemplateLiteralNodeParser implements SubNodeParser {
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

        const types: BaseType[] = [];

        const prefix = node.head.text;
        if (prefix) {
            types.push(new LiteralType(prefix));
        }

        for (const span of node.templateSpans) {
            types.push(this.childNodeParser.createType(span.type, context));

            const suffix = span.literal.text;
            if (suffix) {
                types.push(new LiteralType(suffix));
            }
        }

        if (isExtendsType(node)) {
            return new TemplateLiteralType(types);
        }

        return this.expandTypes(types);
    }

    protected expandTypes(types: BaseType[]): BaseType {
        let expanded: string[] = [""];

        for (const type of types) {
            // Any `never` type in the template literal will make the whole type `never`
            if (type instanceof NeverType) {
                return new NeverType();
            }

            try {
                const literals = extractLiterals(type);
                expanded = expanded.flatMap((prefix) => literals.map((suffix) => prefix + suffix));
            } catch {
                return new StringType();
            }
        }

        if (expanded.length === 1) {
            return new LiteralType(expanded[0]);
        }

        return new UnionType(expanded.map((literal) => new LiteralType(literal)));
    }
}
