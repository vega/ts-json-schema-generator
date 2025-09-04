import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownNodeError } from "../Error/Errors.js";

export class NewExpressionParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.NewExpression): boolean {
        return node.kind === ts.SyntaxKind.NewExpression;
    }

    public createType(node: ts.NewExpression, context: Context): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);

        const symbol = type.symbol || type.aliasSymbol;

        const decl =
            this.typeChecker.typeToTypeNode(type, node, ts.NodeBuilderFlags.IgnoreErrors) ||
            symbol?.valueDeclaration ||
            symbol?.declarations?.[0];

        if (!decl) {
            throw new UnknownNodeError(node);
        }

        return this.childNodeParser.createType(decl, this.createSubContext(node, context));
    }

    protected createSubContext(node: ts.NewExpression, parentContext: Context): Context {
        const subContext = new Context(node);

        if (node.arguments) {
            for (const arg of node.arguments) {
                const type = this.childNodeParser.createType(arg, parentContext);
                subContext.pushArgument(type);
            }
        }
        return subContext;
    }
}
