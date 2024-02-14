import { NodeParser } from "../NodeParser";
import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { getKey } from "../Utils/nodeKey";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { nodeFilename } from "../Utils/nodeFilename";

export class ObjectLiteralExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ObjectLiteralExpression): boolean {
        return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
    }

    public createType(node: ts.ObjectLiteralExpression, context: Context): BaseType {
        const properties = node.properties.map(
            (t) =>
                new ObjectProperty(
                    t.name!.getText(),
                    this.childNodeParser.createType((t as any).initializer, context),
                    !(t as any).questionToken
                )
        );

        return new ObjectType(`object-${getKey(node, context)}`, [], properties, false, false, nodeFilename(node));
    }
}
