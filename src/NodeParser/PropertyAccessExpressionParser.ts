import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class PropertyAccessExpressionParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker, protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.PropertyAccessExpression): boolean {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression;
    }

    public createType(node: ts.PropertyAccessExpression, context: Context): BaseType | undefined {
        const type = this.typeChecker.getTypeAtLocation(node);
        return this.childNodeParser.createType(type.symbol.declarations![0], context);
    }
}
