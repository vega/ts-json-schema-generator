import ts, { MethodSignature, PropertySignature } from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { NeverType } from "../Type/NeverType.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { isNodeHidden } from "../Utils/isHidden.js";
import { getKey } from "../Utils/nodeKey.js";

export class TypeLiteralNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
        protected readonly additionalProperties: boolean
    ) {}

    public supportsNode(node: ts.TypeLiteralNode): boolean {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }
    public createType(node: ts.TypeLiteralNode, context: Context, reference?: ReferenceType): BaseType {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        const properties = this.getProperties(node, context);

        if (properties === undefined) {
            return new NeverType();
        }

        return new ObjectType(id, [], properties, this.getAdditionalProperties(node, context));
    }

    protected getProperties(node: ts.TypeLiteralNode, context: Context): ObjectProperty[] | undefined {
        let hasRequiredNever = false;

        const properties = node.members
            .filter(
                (element): element is PropertySignature | MethodSignature =>
                    ts.isPropertySignature(element) || ts.isMethodSignature(element)
            )
            .filter((propertyNode) => !isNodeHidden(propertyNode))
            .map(
                (propertyNode) =>
                    new ObjectProperty(
                        this.getPropertyName(propertyNode.name),
                        this.childNodeParser.createType(propertyNode.type!, context),
                        !propertyNode.questionToken
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

    protected getAdditionalProperties(node: ts.TypeLiteralNode, context: Context): BaseType | boolean {
        const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }

        return this.childNodeParser.createType(indexSignature.type, context) ?? this.additionalProperties;
    }

    protected getTypeId(node: ts.Node, context: Context): string {
        return `structure-${getKey(node, context)}`;
    }

    protected getPropertyName(propertyName: ts.PropertyName): string {
        if (propertyName.kind === ts.SyntaxKind.ComputedPropertyName) {
            const symbol = this.typeChecker.getSymbolAtLocation(propertyName);

            if (symbol) {
                return symbol.getName();
            }
        }

        try {
            return propertyName.getText();
        } catch {
            // When propertyName was programmatically created, it doesn't have a source file.
            // Then, getText() will throw an error. But, for programmatically created nodes,`
            // `escapedText` is available.
            return (propertyName as ts.Identifier).escapedText as string;
        }
    }
}
