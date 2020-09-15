import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { notUndefined } from "../Utils/notUndefined";
import { TupleType } from "../Type/TupleType";

export class ArrayLiteralExpressionNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ArrayLiteralExpression): boolean {
        return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
    }

    public createType(node: ts.ArrayLiteralExpression, context: Context): BaseType | undefined {
        if (node.elements) {
            const elements = node.elements.map((t) => this.childNodeParser.createType(t, context)).filter(notUndefined);

            return new TupleType(elements);
        }

        // TODO: implement this?
        return undefined;
    }
}
