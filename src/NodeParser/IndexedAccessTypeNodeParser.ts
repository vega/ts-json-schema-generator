import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    public createType(node: ts.IndexedAccessTypeNode, context: Context): BaseType {
        const symbol: ts.Symbol = this.typeChecker.getSymbolAtLocation((<ts.TypeQueryNode>node.objectType).exprName)!;

        if(
            // @ts-ignore
            node.indexType && node.indexType.type && node.indexType.type.typeName &&
            // @ts-ignore
            node.indexType.type.typeName.text &&
            // @ts-ignore
            node.objectType && node.objectType.typeName &&
            // @ts-ignore
            node.objectType.typeName.text === node.indexType.type.typeName.text
        ) {
            
            // @ts-ignore
            return this.childNodeParser.createType(context.getArguments()[0], context)
           // return context.getArguments()[0]
            // let ot = context.getParameterProperties(node.objectType.typeName.text)

            // return new EnumType(
            //     `indexed-type-${node.getFullStart()}`,
            //     (<any>symbol.valueDeclaration).type.elementTypes.map((memberType: ts.Node) =>
            //         this.childNodeParser.createType(memberType, context)),
            // );
            // return new EnumType(
            //     `indexed-type-${node.getFullStart()}`,
            //     // @ts-ignore
            //     context.getParameterProperties(node.objectType.typeName).map((ot) => {

            //     })
            // )
        } else {
            return new EnumType(
                `indexed-type-${node.getFullStart()}`,
                (<any>symbol.valueDeclaration).type.elementTypes.map((memberType: ts.Node) =>
                    this.childNodeParser.createType(memberType, context)),
            );
        }

    }
}
