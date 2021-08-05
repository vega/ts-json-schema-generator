import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
import { isNodeHidden } from "../Utils/isHidden";
import { getKey } from "../Utils/nodeKey";

export class TypeLiteralNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser, private readonly additionalProperties: boolean) {}

    public supportsNode(node: ts.TypeLiteralNode): boolean {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }
    public createType(node: ts.TypeLiteralNode, context: Context, reference?: ReferenceType): BaseType | undefined {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        const properties = this.getProperties(node, context);

        if (properties === undefined) {
            return undefined;
        }

        return new ObjectType(id, [], properties, this.getAdditionalProperties(node, context));
    }

    private getProperties(node: ts.TypeLiteralNode, context: Context): ObjectProperty[] | undefined {
        let hasRequiredNever = false;

        const properties = node.members
            .filter((member) => ts.isPropertySignature(member) || ts.isMethodSignature(member))
            .filter((propertyNode) => !isNodeHidden(propertyNode))
            .map((propertyNode) => {
                const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
                if (ts.isPropertySignature(propertyNode)) {
                    return new ObjectProperty(
                        propertySymbol.getName(),
                        this.childNodeParser.createType(propertyNode.type!, context),
                        !propertyNode.questionToken
                    );
                } else {
                    const methodNode = propertyNode as ts.MethodSignature;
                    return new ObjectProperty(
                        propertySymbol.getName(),
                        this.childNodeParser.createType(methodNode, context),
                        !methodNode.questionToken
                    );
                }
            })
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

    private getAdditionalProperties(node: ts.TypeLiteralNode, context: Context): BaseType | boolean {
        const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }

        return this.childNodeParser.createType(indexSignature.type!, context) ?? this.additionalProperties;
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `structure-${getKey(node, context)}`;
    }
}
