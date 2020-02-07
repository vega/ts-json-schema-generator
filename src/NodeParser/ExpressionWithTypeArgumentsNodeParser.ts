import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    public createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType | undefined {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations![0],
                this.createSubContext(node, context)
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else {
            return this.childNodeParser.createType(typeSymbol.declarations![0], this.createSubContext(node, context));
        }
    }

    private createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach(typeArg => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}
