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
            for (const typeParam of node.typeParameters) {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name)!;
                context.pushParameter(nameSymbol.name);

                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            }
        }

        const id = this.getTypeId(node, context);
        const name = this.getTypeName(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(name);
        }

        const type = this.childNodeParser.createType(node.type, context);
        if (type === undefined) {
            return undefined;
        }
        return new AliasType(id, type);
    }

    private getTypeId(node: ts.TypeAliasDeclaration, context: Context): string {
        return `alias-${getKey(node, context)}`;
    }

    private getTypeName(node: ts.TypeAliasDeclaration, context: Context): string {
        const argumentIds = context.getArguments().map((arg) => arg?.getName());
        const fullName = node.name.getText();

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
