import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { UnionType } from "../Type/UnionType";
import { LiteralType } from "../Type/LiteralType";
import { ObjectProperty } from "../..";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    // @ts-ignore
    public createType(node: ts.IndexedAccessTypeNode, context: Context): BaseType {
        // @ts-ignore
        if (node.indexType && node.indexType.type && node.objectType && node.objectType.type) {
            //if there's a type operator in the key access: [keyof T]
            //And if the object being indexed is a mapped type

            let keys = this.childNodeParser.createType(node.indexType, context);

            let mappedType = this.childNodeParser.createType(node.objectType, context);
            return new UnionType(
                // @ts-ignore
                keys.getTypes().map((litType: LiteralType) => {
                    // @ts-ignore
                    let objProp = mappedType.properties.find((objProp: ObjectProperty) => {
                        if (objProp.getName() == litType.getValue()){
                            return true;
                        }
                        return false;
                    });
                    return objProp.type.type;
                })
            )
        }

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
            return this.childNodeParser.createType(context.getArguments()[0], context) //When is this ever executed? T[T] ??
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
        }  else if (
            // @ts-ignore
            node.objectType && node.objectType.type
            // @ts-ignore
            && node.indexType && node.indexType.type
            // @ts-ignore
            && node.indexType.type.typeName
            // @ts-ignore
            && node.indexType.type.typeName.text
        ) {
            //If The object being indexed is a mapped type (SyntaxKind 173) (and not a type reference).
            //IndexType is something like [keyof T] since indexType has .type which is T.
            /*
                {
                    [K in keyof T]: Pick<T, K>
                } [keyof T]
            */
           let argument = context.getArguments()[0];
            return new EnumType(
                `indexed-type-${node.getFullStart()}`,
                // @ts-ignore
                argument.type.properties.map((property: ObjectProperty) => {
                    let context = new Context();
                    context.pushArgument(property.getType());
                    return this.childNodeParser.createType(node.objectType, context);
                })
            )
        // @ts-ignore
        } else if (node.objectType.exprName) {//Only works if syntaxkind of  node.objectType is typequery and has expression name
            const symbol: ts.Symbol = this.typeChecker.getSymbolAtLocation((<ts.TypeQueryNode>node.objectType).exprName)!;
            return new EnumType(
                `indexed-type-${node.getFullStart()}`,
                (<any>symbol.valueDeclaration).type.elementTypes.map((memberType: ts.Node) =>
                    this.childNodeParser.createType(memberType, context)),
            );
        }

    }
}
