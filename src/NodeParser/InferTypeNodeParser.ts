import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
// import { AnnotatedType } from "../Type/AnnotatedType";
// import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { InferType } from "../Type/InferType";
// import { StringType } from "../Type/StringType";

// const invlidTypes: { [index: number]: boolean } = {
//     [ts.SyntaxKind.ModuleDeclaration]: true,
//     [ts.SyntaxKind.VariableDeclaration]: true,
// };

export class InferTypeNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker, protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.InferTypeNode): boolean {
        return node.kind === ts.SyntaxKind.InferType;
    }

    public createType(node: ts.InferTypeNode, context: Context): BaseType | undefined {
        // console.dir(context, { depth: null });
        // console.log(node.typeParameter.name);
        // console.log(context.getArguments()[0].type.types[0].properties);
        // console.log(context.getReference());
        // console.log(this.typeChecker.getSymbolAtLocation(context.getReference()!));
        // console.log(context.getArgument("T"));
        return new InferType(node.typeParameter.name.escapedText.toString());
        // const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
        // if (typeSymbol.flags & ts.SymbolFlags.Alias) {
        //     const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
        //     return this.childNodeParser.createType(
        //         aliasedSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0],
        //         this.createSubContext(node, context)
        //     );
        // } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
        //     return context.getArgument(typeSymbol.name);
        // } else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
        //     const type = this.createSubContext(node, context).getArguments()[0];
        //     if (type === undefined) {
        //         return undefined;
        //     }
        //     return new ArrayType(type);
        // } else if (typeSymbol.name === "Date") {
        //     return new AnnotatedType(new StringType(), { format: "date-time" }, false);
        // } else if (typeSymbol.name === "RegExp") {
        //     return new AnnotatedType(new StringType(), { format: "regex" }, false);
        // } else {
        //     return this.childNodeParser.createType(
        //         typeSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0],
        //         this.createSubContext(node, context)
        //     );
        // }
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
