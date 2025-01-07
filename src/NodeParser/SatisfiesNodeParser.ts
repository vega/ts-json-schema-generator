import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class SatisfiesNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.SatisfiesExpression): boolean {
        return node.kind === ts.SyntaxKind.SatisfiesExpression;
    }
    public createType(node: ts.SatisfiesExpression, context: Context): BaseType {
        return this.childNodeParser.createType(node.expression, context);
    }
}
