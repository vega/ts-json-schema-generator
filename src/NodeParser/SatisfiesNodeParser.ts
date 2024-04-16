import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class SatisfiesNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.SatisfiesExpression): boolean {
        return node.kind === ts.SyntaxKind.SatisfiesExpression;
    }
    public createType(node: ts.SatisfiesExpression, context: Context): BaseType {
        return this.childNodeParser.createType(node.expression, context);
    }
}
