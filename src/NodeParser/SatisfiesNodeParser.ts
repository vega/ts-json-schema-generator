import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";

export class SatisfiesNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.SatisfiesExpression): boolean {
        return node.kind === ts.SyntaxKind.SatisfiesExpression;
    }
    public createType(node: ts.SatisfiesExpression, context: Context): BaseType {
        return this.childNodeParser.createType(node.expression, context);
    }
}
