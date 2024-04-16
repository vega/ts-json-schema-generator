import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";

export class PropertyAccessExpressionParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
    ) {}

    public supportsNode(node: ts.PropertyAccessExpression): boolean {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression;
    }

    public createType(node: ts.PropertyAccessExpression, context: Context): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);
        return this.childNodeParser.createType(type.symbol.declarations![0], context);
    }
}
