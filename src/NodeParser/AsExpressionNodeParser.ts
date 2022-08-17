import { NodeParser } from "../NodeParser";
import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class AsExpressionNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.AsExpression): boolean {
        return node.kind === ts.SyntaxKind.AsExpression;
    }
    public createType(node: ts.AsExpression, context: Context): BaseType {
        // only implement `as const` for now where we just ignore the as expression
        return this.childNodeParser.createType(node.expression, context);
    }
}
