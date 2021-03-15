import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
import { isNodeHidden } from "../Utils/isHidden";
import { isPublic, isStatic } from "../Utils/modifiers";
import { getKey } from "../Utils/nodeKey";
import { notUndefined } from "../Utils/notUndefined";

export class InterfaceAndClassNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
        private readonly additionalProperties: boolean
    ) {}

    public supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.ClassDeclaration;
    }

    public createType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context,
        reference?: ReferenceType
    ): BaseType | undefined {
        if (node.typeParameters?.length) {
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

        if (properties === undefined) {
            return undefined;
        }

        const additionalProperties = this.getAdditionalProperties(node, context);

        // When type only extends Array or ReadonlyArray then create an array type instead of an object type
        if (properties.length === 0 && additionalProperties === false) {
            const arrayItemType = this.getArrayItemType(node);
            if (arrayItemType) {
                const type = this.childNodeParser.createType(arrayItemType, context);
                if (type === undefined) {
                    return undefined;
                }
                return new ArrayType(type);
            }
        }

        return new ObjectType(id, this.getBaseTypes(node, context), properties, additionalProperties);
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
                    if (typeArguments?.length === 1) {
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

        return node.heritageClauses.reduce(
            (result: BaseType[], baseType) => [
                ...result,
                ...baseType.types
                    .map((expression) => this.childNodeParser.createType(expression, context))
                    .filter(notUndefined),
            ],
            []
        );
    }

    private getProperties(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context
    ): ObjectProperty[] | undefined {
        let hasRequiredNever = false;

        const properties = (node.members as ts.NodeArray<ts.TypeElement | ts.ClassElement>)
            .reduce((members, member) => {
                if (ts.isConstructorDeclaration(member)) {
                    const params = member.parameters.filter((param) =>
                        ts.isParameterPropertyDeclaration(param, param.parent)
                    ) as ts.ParameterPropertyDeclaration[];
                    members.push(...params);
                } else if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
                    members.push(member);
                }
                return members;
            }, [] as (ts.PropertyDeclaration | ts.PropertySignature | ts.ParameterPropertyDeclaration)[])
            .filter((member) => isPublic(member) && !isStatic(member) && member.type && !isNodeHidden(member))
            .map(
                (member) => {
                    let nameToExport = member.name.getText();
                    if (member.name.kind === ts.SyntaxKind.ComputedPropertyName) {
                        const f = require(member.name.getSourceFile().fileName);
                        // @ts-ignore
                        if (member.name.expression && member.name.expression.escapedText!) {
                            // @ts-ignore
                            nameToExport = f[member.name.expression.escapedText];
                        }
                    }

                    return new ObjectProperty(
                        nameToExport,
                        this.childNodeParser.createType(member.type!, context),
                        !member.questionToken
                    )
                }
            )
            .filter((prop) => {
                if (prop.isRequired() && prop.getType() === undefined) {
                    hasRequiredNever = true;
                }
                return prop.getType() !== undefined;
            });

        if (hasRequiredNever) {
            return undefined;
        }

        return properties;
    }

    private getAdditionalProperties(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context
    ): BaseType | boolean {
        const indexSignature = (node.members as ts.NodeArray<ts.NamedDeclaration>).find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }

        return this.childNodeParser.createType(indexSignature.type!, context) ?? this.additionalProperties;
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const nodeType = ts.isInterfaceDeclaration(node) ? "interface" : "class";
        return `${nodeType}-${getKey(node, context)}`;
    }
}
