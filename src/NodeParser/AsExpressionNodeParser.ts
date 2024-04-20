import { NodeParser } from "../NodeParser.js";
import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";

export class AsExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.AsExpression): boolean {
        return node.kind === ts.SyntaxKind.AsExpression;
    }
    public createType(node: ts.AsExpression, context: Context): BaseType | undefined {
        // only implement `as const` for now where we just ignore the as expression
        return this.childNodeParser.createType(node.expression, context);
    }
}
