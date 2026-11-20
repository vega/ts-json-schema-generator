import ts from "typescript";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class ImportTypeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ImportTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ImportType;
    }

    public createType(node: ts.ImportTypeNode, context: Context): BaseType {
        // Resolve the symbol from the qualifier (e.g., `MyType` in `import("./module").MyType`)
        const symbolLocation = node.qualifier ?? node;
        const typeSymbol = this.typeChecker.getSymbolAtLocation(symbolLocation)!;

        // Handle transitive re-exports
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations![0],
                this.createSubContext(node, context),
            );
        }

        return this.childNodeParser.createType(typeSymbol.declarations![0], this.createSubContext(node, context));
    }

    protected createSubContext(node: ts.ImportTypeNode, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            for (const typeArg of node.typeArguments) {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            }
        }
        return subContext;
    }
}
