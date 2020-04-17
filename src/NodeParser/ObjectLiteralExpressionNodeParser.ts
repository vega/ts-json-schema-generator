import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { getKey } from "../Utils/nodeKey";
import { ObjectProperty, ObjectType } from "./../Type/ObjectType";

export class ObjectLiteralExpressionNodeParser implements SubNodeParser {
    public supportsNode(node: ts.ObjectLiteralExpression): boolean {
        return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
    }

    public createType(node: ts.ObjectLiteralExpression, context: Context): BaseType | undefined {
        if (node.properties) {
            const properties = node.properties.map((t: any) => new ObjectProperty(t.name.getText(), undefined, true));

            return new ObjectType(`object-${getKey(node, context)}`, [], properties, false);
        }

        // TODO: implement this?
        return undefined;
    }
}
