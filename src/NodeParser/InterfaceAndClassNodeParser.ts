import ts, { PropertyName } from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
import { isNodeHidden } from "../Utils/isHidden";
import { isPublic, isStatic } from "../Utils/modifiers";
import { getKey } from "../Utils/nodeKey";

export class InterfaceAndClassNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
        protected readonly additionalProperties: boolean
    ) {}

    public supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.ClassDeclaration;
    }

    public createType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context,
        reference?: ReferenceType
    ): BaseType {
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
            return new NeverType();
        }

        const additionalProperties = this.getAdditionalProperties(node, context);

        // When type only extends Array or ReadonlyArray then create an array type instead of an object type
        if (properties.length === 0 && additionalProperties === false) {
            const arrayItemType = this.getArrayItemType(node);
            if (arrayItemType) {
                return new ArrayType(this.childNodeParser.createType(arrayItemType, context));
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
    protected getArrayItemType(node: ts.InterfaceDeclaration | ts.ClassDeclaration): ts.TypeNode | null {
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

    protected getBaseTypes(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType[] {
        if (!node.heritageClauses) {
            return [];
        }

        return node.heritageClauses.reduce(
            (result: BaseType[], baseType) => [
                ...result,
                ...baseType.types.map((expression) => this.childNodeParser.createType(expression, context)),
            ],
            []
        );
    }

    protected getProperties(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context
    ): ObjectProperty[] | undefined {
        let hasRequiredNever = false;

        const properties = (node.members as ts.NodeArray<ts.TypeElement | ts.ClassElement>)
            .reduce(
                (members, member) => {
                    if (ts.isConstructorDeclaration(member)) {
                        const params = member.parameters.filter((param) =>
                            ts.isParameterPropertyDeclaration(param, param.parent)
                        ) as ts.ParameterPropertyDeclaration[];
                        members.push(...params);
                    } else if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
                        members.push(member);
                    }
                    return members;
                },
                [] as (ts.PropertyDeclaration | ts.PropertySignature | ts.ParameterPropertyDeclaration)[]
            )
            .filter((member) => isPublic(member) && !isStatic(member) && !isNodeHidden(member))
            .reduce((entries, member) => {
                let memberType: ts.Node | undefined = member.type;

                // Use the type checker if the member has no explicit type
                // Ignore members without an initializer. They have no useful type.
                if (memberType === undefined && (member as ts.PropertyDeclaration)?.initializer !== undefined) {
                    const type = this.typeChecker.getTypeAtLocation(member);
                    memberType = this.typeChecker.typeToTypeNode(type, node, ts.NodeBuilderFlags.NoTruncation);
                }

                if (memberType !== undefined) {
                    return [...entries, { member, memberType }];
                }
                return entries;
            }, [])
            .map(
                ({ member, memberType }) =>
                    new ObjectProperty(
                        this.getPropertyName(member.name),
                        this.childNodeParser.createType(memberType, context),
                        !member.questionToken
                    )
            )
            .filter((prop) => {
                const type = prop.getType();
                if (prop.isRequired() && type instanceof NeverType) {
                    hasRequiredNever = true;
                }
                return !(type instanceof NeverType);
            });

        if (hasRequiredNever) {
            return undefined;
        }

        return properties;
    }

    protected getAdditionalProperties(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context
    ): BaseType | boolean {
        const indexSignature = (node.members as ts.NodeArray<ts.NamedDeclaration>).find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }

        return this.childNodeParser.createType(indexSignature.type, context) ?? this.additionalProperties;
    }

    protected getTypeId(node: ts.Node, context: Context): string {
        const nodeType = ts.isInterfaceDeclaration(node) ? "interface" : "class";
        return `${nodeType}-${getKey(node, context)}`;
    }

    protected getPropertyName(propertyName: PropertyName): string {
        if (propertyName.kind === ts.SyntaxKind.ComputedPropertyName) {
            const symbol = this.typeChecker.getSymbolAtLocation(propertyName);
            if (symbol) {
                return symbol.getName();
            }
        }
        return propertyName.getText();
    }
}
