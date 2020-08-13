import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectType, ObjectProperty } from "../Type/ObjectType";
import { getKey } from "../Utils/nodeKey";

export class SourceFileNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: SubNodeParser) {}

    public supportsNode(node: ts.SourceFile): boolean {
        return node.kind === ts.SyntaxKind.SourceFile;
    }

    public createType(node: ts.SourceFile, context: Context): BaseType {
        const properties = this.getProperties(node);
        return new ObjectType(`namespace-${getKey(node, context)}`, [], properties, false);
    }

    private getProperties(sourceFile: ts.SourceFile): ObjectProperty[] {
        const properties: ObjectProperty[] = [];

        const moduleSymbol = this.typeChecker.getSymbolAtLocation(sourceFile);
        if (moduleSymbol) {
            for (const symbol of this.typeChecker.getExportsOfModule(moduleSymbol)) {
                const resolved = this.resolveAliasedSymbol(symbol);

                resolved.declarations?.forEach((declaration) => {
                    if (this.childNodeParser.supportsNode(declaration)) {
                        properties.push(
                            new ObjectProperty(
                                symbol.name,
                                this.childNodeParser.createType(declaration, new Context()),
                                false
                            )
                        );
                    }
                });
            }
        }

        return properties;
    }

    private resolveAliasedSymbol(symbol: ts.Symbol): ts.Symbol {
        return symbol && ts.SymbolFlags.Alias & symbol.flags ? this.typeChecker.getAliasedSymbol(symbol) : symbol;
    }
}
