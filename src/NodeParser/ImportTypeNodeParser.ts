import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ImportTypeNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ImportTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ImportType;
    }

    public createType(node: ts.ImportTypeNode, context: Context): BaseType | undefined {
        const moduleSymbol = this.typeChecker.getSymbolAtLocation(node);
        if (moduleSymbol) {
            const exportSymbols = this.typeChecker.getExportsOfModule(moduleSymbol);

            const importQualifier = node.qualifier ? node.qualifier.getText() : "default";
            const exportSymbol = exportSymbols.find((exportSymbolItem) => {
                return exportSymbolItem.getName() === importQualifier;
            });

            if (exportSymbol && exportSymbol.declarations.length) {
                return this.childNodeParser.createType(
                    exportSymbol.declarations[0],
                    this.createSubContext(node, context)
                );
            }
        }

        return undefined;
    }

    private createSubContext(node: ts.ImportTypeNode, parentContext: Context): Context {
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
