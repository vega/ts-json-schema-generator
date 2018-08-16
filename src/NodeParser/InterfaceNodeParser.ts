import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { isHidden } from "../Utils/isHidden";

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
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name)!;
                context.pushParameter(nameSymbol.name);
            });
        }

        return new ObjectType(
            this.getTypeId(node, context),
            this.getBaseTypes(node, context),
            this.getProperties(node, context),
            this.getAdditionalProperties(node, context)
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
                if (isHidden(propertySymbol)) {
                    return result;
                }
                const objectProperty: ObjectProperty = new ObjectProperty(
                    propertySymbol.getName(),
                    this.childNodeParser.createType(propertyNode.type!, context),
                    !propertyNode.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
    }

    private getAdditionalProperties(node: ts.InterfaceDeclaration, context: Context): BaseType | false {
        const properties: ts.TypeElement[] = node.members
            .filter((property: ts.TypeElement) => property.kind === ts.SyntaxKind.IndexSignature);
            if (!properties.length) {
                // If the interface extends another interface - check the generic if it exists ...
                // @ts-ignore
                if (node.heritageClauses) {
                    // @ts-ignore
                    if (node.heritageClauses[0].types[0].typeArguments) {
                        // @ts-ignore
                        let extendedTypeArgument = node.heritageClauses[0].types[0].typeArguments[0];
                        let extendedNode = this.childNodeParser.createType(extendedTypeArgument, context);
                        // @ts-ignore
                        if (extendedNode.name === "any" || extendedNode.name === "object" || extendedNode.constructor.name === "AnyType") {
                            return extendedNode;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                const signature: ts.IndexSignatureDeclaration = properties[0] as ts.IndexSignatureDeclaration;
                return this.childNodeParser.createType(signature.type!, context);
            }
    }


    private getTypeId(node: ts.Node, context: Context): string {
        const fullName = `interface-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
