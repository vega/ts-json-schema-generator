import ts from "typescript";

import { Context, NodeParser } from "../NodeParser";
import type { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType } from "../Type/AnnotatedType";
import { AnyType } from "../Type/AnyType";
import { ArrayType } from "../Type/ArrayType";
import type { BaseType } from "../Type/BaseType";
import { StringType } from "../Type/StringType";

const invlidTypes: { [index: number]: boolean } = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }

    public createType(node: ts.TypeReferenceNode, context: Context): BaseType {
        let typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;

        // CHANGED HERE
        //
        // @ts-expect-error - Handle promise type
        if ((typeSymbol?.name || node.typeName.escapedText) === "Promise") {
            return this.childNodeParser.createType(node.typeArguments![0]!, this.createSubContext(node, context));
        }

        if (!typeSymbol) {
            //@ts-expect-error - If the node doesn't have a valid source file, typeSymbol gets undefined
            // but we may have a typeName with a valid symbol
            typeSymbol = node.typeName.symbol;
        }

        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);

            return this.childNodeParser.createType(
                aliasedSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0]!,

                this.createSubContext(node, context)
            );
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

        return this.childNodeParser.createType(
            typeSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0]!,
            this.createSubContext(node, context)
        );
    }

    private createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            for (const typeArg of node.typeArguments) {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            }
        }
        return subContext;
    }
}
