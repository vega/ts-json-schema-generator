import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
import { isNodeHidden } from "../Utils/isHidden";
import { getKey } from "../Utils/nodeKey";

export class TypeLiteralNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser, protected readonly additionalProperties: boolean) {}

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
            .filter(ts.isPropertySignature)
            .filter((propertyNode) => !isNodeHidden(propertyNode))
            .map((propertyNode) => {
                const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
                const type = this.childNodeParser.createType(propertyNode.type!, context);
                const objectProperty = new ObjectProperty(propertySymbol.getName(), type, !propertyNode.questionToken);

                return objectProperty;
            })
            .filter((prop) => {
                if (prop.isRequired() && prop.getType() instanceof NeverType) {
                    hasRequiredNever = true;
                }
                return !(prop.getType() instanceof NeverType);
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

        return this.childNodeParser.createType(indexSignature.type!, context) ?? this.additionalProperties;
    }

    protected getTypeId(node: ts.Node, context: Context): string {
        return `structure-${getKey(node, context)}`;
    }
}
