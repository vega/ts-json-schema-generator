import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";

const invlidTypes: {[index: number]: boolean} = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

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
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0],
                this.createSubContext(node, context),
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            return new ArrayType(this.createSubContext(node, context).getArguments()[0]);
        } else {
            return this.childNodeParser.createType(
                typeSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0],
                this.createSubContext(node, context),
            );
        }
    }

    private createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg: ts.TypeNode) => {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    }
}
