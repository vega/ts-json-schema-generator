import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";

export class TypeAliasNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeAliasDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }
    public createType(node: ts.TypeAliasDeclaration, context: Context): BaseType {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam: ts.TypeParameterDeclaration) => {
                const nameSymbol: ts.Symbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }

        return new AliasType(
            this.getTypeId(node, context),
            this.childNodeParser.createType(node.type, context),
        );
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName: string = `alias-${node.getFullStart()}`;
        const argumentIds: string[] = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
