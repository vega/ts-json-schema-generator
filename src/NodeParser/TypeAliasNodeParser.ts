import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { getKey } from "../Utils/nodeKey";

export class TypeAliasNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeAliasDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }

    public createType(
        node: ts.TypeAliasDeclaration,
        context: Context,
        reference?: ReferenceType
    ): BaseType | undefined {
        if (node.typeParameters?.length) {
            node.typeParameters.forEach(typeParam => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name)!;
                context.pushParameter(nameSymbol.name);

                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            });
        }

        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        const type = this.childNodeParser.createType(node.type, context);
        if (type === undefined) {
            return undefined;
        }
        return new AliasType(id, type);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `alias-${getKey(node, context)}`;
    }
}
