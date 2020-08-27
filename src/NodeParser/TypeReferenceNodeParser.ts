import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { PromiseType } from "../Type/PromiseType";
import { BaseType } from "../Type/BaseType";

const invalidTypes: { [index: number]: boolean } = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }

    public createType(node: ts.TypeReferenceNode, context: Context): BaseType | undefined {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            if (aliasedSymbol.declarations) {
                return this.childNodeParser.createType(
                    aliasedSymbol.declarations.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                    this.createSubContext(node, context)
                );
            } else if (typeSymbol.declarations) {
                return this.childNodeParser.createType(
                    typeSymbol.declarations.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                    this.createSubContext(node, context)
                );
            }

            return undefined;
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            const argument = context.getArgument(typeSymbol.name);
            if (!argument) {
                return this.childNodeParser.createType(
                    typeSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                    this.createSubContext(node, context)
                );
            }
            return argument;
        } else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            const type = this.createSubContext(node, context).getArguments()[0];
            if (type === undefined) {
                return undefined;
            }
            return new ArrayType(type);
        } else if (typeSymbol.name === "Promise") {
            const typeArgument = node.typeArguments?.[0];
            return new PromiseType(typeArgument ? this.childNodeParser.createType(typeArgument, context) : undefined);
        } else {
            return this.childNodeParser.createType(
                typeSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                this.createSubContext(node, context)
            );
        }
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
