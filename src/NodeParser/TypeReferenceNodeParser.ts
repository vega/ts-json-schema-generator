import ts from "typescript";

import { Context, NodeParser } from "../NodeParser";
import type { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType } from "../Type/AnnotatedType";
import { AnyType } from "../Type/AnyType";
import { ArrayType } from "../Type/ArrayType";
import type { BaseType } from "../Type/BaseType";
import { StringType } from "../Type/StringType";

const invalidTypes: Record<number, boolean> = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
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
            (node.typeName as unknown as ts.Type).symbol;

        // Wraps promise type to avoid resolving to a empty Object type.
        if (typeSymbol.name === "Promise") {
            return this.childNodeParser.createType(node.typeArguments![0]!, this.createSubContext(node, context));
        }

        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);

            const declaration = aliasedSymbol.declarations?.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0];

            if (!declaration) {
                // fallback for bun.sh
                return new AnyType();
            }

            return this.childNodeParser.createType(declaration, this.createSubContext(node, context));
        }

        if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
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

        return this.childNodeParser.createType(
            typeSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
            this.createSubContext(node, context)
        );
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
