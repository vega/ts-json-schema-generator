import * as ts from "typescript";
import { NodeParser, Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }
    public createType(node: ts.TypeReferenceNode, context: Context): BaseType {
        const typeSymbol: ts.Symbol = this.typeChecker.getSymbolAtLocation(node.typeName);
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol: ts.Symbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations[0],
                this.createSubContext(node, context),
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else {
            return this.childNodeParser.createType(
                typeSymbol.declarations[0],
                this.createSubContext(node, context),
            );
        }
    }

    private createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext: Context = new Context();
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg: ts.TypeNode) => {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    }
}
