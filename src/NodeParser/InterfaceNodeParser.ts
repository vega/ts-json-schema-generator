import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";

export class InterfaceNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.InterfaceDeclaration): boolean {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration;
    }
    public createType(node: ts.InterfaceDeclaration, context: Context): BaseType {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam: ts.TypeParameterDeclaration) => {
                const nameSymbol: ts.Symbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }

        return new ObjectType(
            this.getTypeId(node, context),
            this.getBaseTypes(node, context),
            this.getProperties(node, context),
            this.getAdditionalProperties(node, context),
        );
    }

    private getBaseTypes(node: ts.InterfaceDeclaration, context: Context): BaseType[] {
        if (!node.heritageClauses) {
            return [];
        }

        return node.heritageClauses.reduce((result: BaseType[], baseType: ts.HeritageClause) => {
            return result.concat(baseType.types.map((expression: ts.ExpressionWithTypeArguments) => {
                return this.childNodeParser.createType(expression, context);
            }));
        }, []);
    }

    private getProperties(node: ts.InterfaceDeclaration, context: Context): ObjectProperty[] {
        return node.members
            .filter((property: ts.TypeElement) => property.kind === ts.SyntaxKind.PropertySignature)
            .reduce((result: ObjectProperty[], propertyNode: ts.PropertySignature) => {
                const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
                const objectProperty: ObjectProperty = new ObjectProperty(
                    propertySymbol.getName(),
                    this.childNodeParser.createType(propertyNode.type!, context),
                    !propertyNode.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
    }

    private getAdditionalProperties(node: ts.InterfaceDeclaration, context: Context): BaseType|false {
        const properties: ts.TypeElement[] = node.members
            .filter((property: ts.TypeElement) => property.kind === ts.SyntaxKind.IndexSignature);
        if (!properties.length) {
            return false;
        }

        const signature: ts.IndexSignatureDeclaration = properties[0] as ts.IndexSignatureDeclaration;
        return this.childNodeParser.createType(signature.type!, context);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName: string = `interface-${node.getFullStart()}`;
        const argumentIds: string[] = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
