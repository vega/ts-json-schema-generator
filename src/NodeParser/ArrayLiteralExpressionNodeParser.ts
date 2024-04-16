import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { TupleType } from "../Type/TupleType.js";

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
