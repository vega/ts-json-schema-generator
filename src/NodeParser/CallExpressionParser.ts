import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class CallExpressionParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.CallExpression): boolean {
        return node.kind === ts.SyntaxKind.CallExpression;
    }
    public createType(node: ts.CallExpression, context: Context): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);
        const symbol = type.symbol || type.aliasSymbol;
        const decl = symbol.valueDeclaration || symbol.declarations[0];
        const subContext = this.createSubContext(node, context);
        return this.childNodeParser.createType(decl, subContext)!;
    }

    private createSubContext(node: ts.CallExpression, parentContext: Context): Context {
        const subContext = new Context(node);

        node.arguments.forEach((arg) => {
            const type = this.childNodeParser.createType(arg, parentContext);
            subContext.pushArgument(type);
        });
        return subContext;
    }
}
