import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { TupleType } from "../Type/TupleType";

export class ArrayLiteralExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ArrayLiteralExpression): boolean {
        return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
    }

    public createType(node: ts.ArrayLiteralExpression, context: Context): BaseType {
        const elements = node.elements.map((t) => this.childNodeParser.createType(t, context));
        return new TupleType(elements);
    }
}
