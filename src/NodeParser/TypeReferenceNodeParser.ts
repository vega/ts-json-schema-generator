import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType } from "../Type/AnnotatedType";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { StringType } from "../Type/StringType";

const invalidTypes: { [index: number]: boolean } = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};

export class TypeReferenceNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker, protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }

    public createType(node: ts.TypeReferenceNode, context: Context): BaseType | undefined {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                this.createSubContext(node, context)
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            const type = this.createSubContext(node, context).getArguments()[0];
            if (type === undefined) {
                return undefined;
            }
            return new ArrayType(type);
        } else if (typeSymbol.name === "Date") {
            return new AnnotatedType(new StringType(), { format: "date-time" }, false);
        } else if (typeSymbol.name === "RegExp") {
            return new AnnotatedType(new StringType(), { format: "regex" }, false);
        } else {
            return this.childNodeParser.createType(
                typeSymbol.declarations!.filter((n: ts.Declaration) => !invalidTypes[n.kind])[0],
                this.createSubContext(node, context)
            );
        }
    }

    protected createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            for (const typeArg of node.typeArguments) {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            }
        }
        return subContext;
    }
}
