import * as ts from "typescript";
import { NodeParser, Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { NameParser } from "../NameParser";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";

export class TypeAliasNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
        private nameParser: NameParser,
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

        const baseType: BaseType = this.childNodeParser.createType(node.type, context);
        if (!this.nameParser.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(
            this.nameParser.getDefinitionName(node, context),
            baseType,
        );
    }
}
