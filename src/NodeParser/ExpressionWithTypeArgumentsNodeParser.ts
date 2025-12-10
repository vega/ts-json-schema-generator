import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    public createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
        if (!typeSymbol) {
            const sourceFile = node.getSourceFile();
            const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            throw new Error(
                `Cannot resolve symbol for expression: ${node.expression.getText()} ` +
                `at ${sourceFile.fileName}:${position.line + 1}:${position.character + 1}`
            );
        }
        
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            const declaration = aliasedSymbol.declarations?.[0];
            if (!declaration) {
                const sourceFile = node.getSourceFile();
                const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                throw new Error(
                    `No declaration found for aliased symbol: ${aliasedSymbol.name} ` +
                    `at ${sourceFile.fileName}:${position.line + 1}:${position.character + 1}`
                );
            }
            
            return this.childNodeParser.createType(
                declaration,
                this.createSubContext(node, context),
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else {
            const declaration = typeSymbol.declarations?.[0];
            if (!declaration) {
                const sourceFile = node.getSourceFile();
                const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                throw new Error(
                    `No declaration found for symbol: ${typeSymbol.name} ` +
                    `at ${sourceFile.fileName}:${position.line + 1}:${position.character + 1}`
                );
            }
            return this.childNodeParser.createType(declaration, this.createSubContext(node, context));
        }
    }

    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}
