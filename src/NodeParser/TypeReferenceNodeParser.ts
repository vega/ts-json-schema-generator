import ts from "typescript";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { AnyType } from "../Type/AnyType.js";
import { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import { StringType } from "../Type/StringType.js";
import { UnknownType } from "../Type/UnknownType.js";
import { UnhandledError } from "../Error/Errors.js";
import { symbolAtNode } from "../Utils/symbolAtNode.js";

const invalidTypes: Record<number, boolean> = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }

    public createType(node: ts.TypeReferenceNode, context: Context): BaseType {
        const typeSymbol =
            this.typeChecker.getSymbolAtLocation(node.typeName) ??
            // When the node doesn't have a valid source file, its position is -1, so we can't
            // search for a symbol based on its location. In that case, the ts.factory defines a symbol
            // property on the node itself.
            symbolAtNode(node.typeName)!;

        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);

            const declaration = aliasedSymbol.declarations?.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0];

            if (!declaration) {
                // fallback for bun.sh
                return new AnyType();
            }

            return this.createTypeFromDeclaration(declaration, node, context);
        }

        if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name) ?? new UnknownType(true);
        }

        // Wraps promise type to avoid resolving to a empty Object type.
        if (typeSymbol.name === "Promise" || typeSymbol.name === "PromiseLike") {
            // Promise without type resolves to Promise<any>
            if (!node.typeArguments || node.typeArguments.length === 0) {
                return new AnyType();
            }

            return this.childNodeParser.createType(node.typeArguments[0], context);
        }

        if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            const type = this.createSubContext(node, context).getArguments()[0];

            return type === undefined ? new AnyType() : new ArrayType(type);
        }

        if (typeSymbol.name === "Date") {
            return new AnnotatedType(new StringType(), { format: "date-time" }, false);
        }

        if (typeSymbol.name === "RegExp") {
            return new AnnotatedType(new StringType(), { format: "regex" }, false);
        }

        if (typeSymbol.name === "URL") {
            return new AnnotatedType(new StringType(), { format: "uri" }, false);
        }

        return this.createTypeFromDeclaration(
            typeSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
            node,
            context,
        );
    }

    /**
     * Resolves a referenced declaration through the child parser, falling back to the
     * type checker's already-resolved type when structural re-parsing crashes.
     *
     * Re-parsing the AST can drive the parser into type-level machinery of third-party
     * libraries (e.g. `zod`'s `z.infer<typeof schema>` conditional types, whose return
     * type is built from deep generics) that cannot be statically re-derived. When that
     * happens an unexpected (non-controlled) error is thrown; in that case we delegate to
     * the type checker, which has already resolved such references to a concrete type.
     */
    protected createTypeFromDeclaration(
        declaration: ts.Declaration,
        node: ts.TypeReferenceNode,
        context: Context,
    ): BaseType {
        try {
            return this.childNodeParser.createType(declaration, this.createSubContext(node, context));
        } catch (error) {
            if (error instanceof UnhandledError) {
                const resolved = this.createTypeFromChecker(node, context);
                if (resolved) {
                    return resolved;
                }
            }
            throw error;
        }
    }

    /**
     * Builds a base type from the type checker's fully-resolved type for the given
     * reference node. Returns undefined when the checker cannot offer a trustworthy
     * concrete type (e.g. it collapses to `any`/`unknown`), so callers can rethrow the
     * original error instead of silently substituting a meaningless schema.
     */
    protected createTypeFromChecker(node: ts.TypeReferenceNode, context: Context): BaseType | undefined {
        let resolvedType: ts.Type;
        try {
            resolvedType = this.typeChecker.getTypeFromTypeNode(node);
        } catch {
            return undefined;
        }

        const typeNode = this.typeChecker.typeToTypeNode(resolvedType, node, ts.NodeBuilderFlags.IgnoreErrors);

        if (!typeNode || typeNode.kind === ts.SyntaxKind.AnyKeyword || typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
            return undefined;
        }
        try {
            const result = this.childNodeParser.createType(typeNode, context);
            if (result instanceof AnyType || result instanceof UnknownType) {
                return undefined;
            }
            return result;
        } catch {
            return undefined;
        }
    }

    protected createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext = new Context(node);

        if (node.typeArguments?.length) {
            for (const typeArg of node.typeArguments) {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            }
        }

        return subContext;
    }
}
