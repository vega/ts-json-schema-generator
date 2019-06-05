import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
import { isHidden } from "../Utils/isHidden";
import { getKey } from "../Utils/nodeKey";

export class InterfaceAndClassNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.ClassDeclaration;
    }

    public createType(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context,
            reference?: ReferenceType): BaseType {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam) => {
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
        return new ObjectType(
            id,
            this.getBaseTypes(node, context),
            this.getProperties(node, context),
            this.getAdditionalProperties(node, context),
        );
    }

    private getBaseTypes(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType[] {
        if (!node.heritageClauses) {
            return [];
        }

        return node.heritageClauses.reduce((result: BaseType[], baseType) => [
            ...result,
            ...baseType.types.map((expression) => this.childNodeParser.createType(expression, context)),
        ], []);
    }

    private getProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): ObjectProperty[] {
        function isProperty(member: ts.Node): member is (ts.PropertyDeclaration | ts.PropertySignature) {
            return ts.isPropertySignature(member) || ts.isPropertyDeclaration(member);
        }
        return (<ts.NodeArray<ts.NamedDeclaration>>node.members)
            .filter(isProperty)
            .filter(prop => !prop.modifiers || !prop.modifiers.some(modifier =>
                modifier.kind === ts.SyntaxKind.PrivateKeyword ||
                modifier.kind === ts.SyntaxKind.ProtectedKeyword ||
                modifier.kind === ts.SyntaxKind.StaticKeyword))
            .reduce((result: ObjectProperty[], propertyNode) => {
                const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
                const propertyType = propertyNode.type;
                if (!propertyType || isHidden(propertySymbol)) {
                    return result;
                }
                const objectProperty: ObjectProperty = new ObjectProperty(
                    propertySymbol.getName(),
                    this.childNodeParser.createType(propertyType, context),
                    !propertyNode.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
    }

    private getAdditionalProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context):
            BaseType | false {
        const indexSignature = (<ts.NodeArray<ts.NamedDeclaration>>node.members).find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return false;
        }

        return this.childNodeParser.createType(indexSignature.type!, context);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const nodeType = ts.isInterfaceDeclaration(node) ? "interface" : "class";
        return `${nodeType}-${getKey(node, context)}`;
    }
}
