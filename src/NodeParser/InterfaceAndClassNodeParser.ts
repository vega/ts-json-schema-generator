import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
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

        const properties = this.getProperties(node, context);
        const additionalProperties = this.getAdditionalProperties(node, context);

        // When type only extends Array or ReadonlyArray then create an array type instead of an object type
        if (properties.length === 0 && additionalProperties === false) {
            const arrayItemType = this.getArrayItemType(node);
            if (arrayItemType) {
                return new ArrayType(this.childNodeParser.createType(arrayItemType, context));
            }
        }

        return new ObjectType(
            id,
            this.getBaseTypes(node, context),
            properties,
            additionalProperties,
        );
    }

    /**
     * If specified node extends Array or ReadonlyArray and nothing else then this method returns the
     * array item type. In all other cases null is returned to indicate that the node is not a simple array.
     *
     * @param node - The interface or class to check.
     * @return The array item type if node is an array, null otherwise.
     */
    private getArrayItemType(node: ts.InterfaceDeclaration | ts.ClassDeclaration): ts.TypeNode | null {
        if (node.heritageClauses && node.heritageClauses.length === 1) {
            const clause = node.heritageClauses[0];
            if (clause.types.length === 1) {
                const type = clause.types[0];
                const symbol = this.typeChecker.getSymbolAtLocation(type.expression);
                if (symbol && (symbol.name === "Array" || symbol.name === "ReadonlyArray")) {
                    const typeArguments = type.typeArguments;
                    if (typeArguments && typeArguments.length === 1) {
                        return typeArguments[0];
                    }
                }
            }
        }
        return null;
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
