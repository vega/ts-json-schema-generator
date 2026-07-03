import ts from "typescript";
import { UnknownNodeError } from "../Error/Errors.js";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    public createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType {
        const subContext = this.createSubContext(node, context);
        const expression = node.expression;

        if (ts.isCallExpression(expression)) {
            return this.childNodeParser.createType(expression, context);
        }

        const typeSymbol = this.typeChecker.getSymbolAtLocation(expression);
        if (!typeSymbol) {
            throw new UnknownNodeError(expression);
        }

        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.createTypeFromSymbol(aliasedSymbol, expression, subContext, context);
        }

        return this.createTypeFromSymbol(typeSymbol, expression, subContext, context);
    }

    protected createTypeFromSymbol(
        typeSymbol: ts.Symbol,
        expression: ts.Expression,
        subContext: Context,
        context: Context,
    ): BaseType {
        if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            const argumentType = context.getArgument(typeSymbol.name);
            if (argumentType) {
                return argumentType;
            }
        }

        const declaration = this.getHeritageDeclaration(typeSymbol, expression);
        const parameterArgumentType = ts.isParameter(declaration)
            ? this.getConstructorParameterArgumentType(declaration, context)
            : undefined;
        if (parameterArgumentType) {
            return parameterArgumentType;
        }

        return this.childNodeParser.createType(
            declaration,
            this.getParseContext(declaration, subContext, context),
        );
    }

    protected getParseContext(declaration: ts.Node, subContext: Context, context: Context): Context {
        if (ts.isCallExpression(declaration) || ts.isClassExpression(declaration)) {
            return context;
        }

        return subContext;
    }

    protected getConstructorParameterArgumentType(
        parameter: ts.ParameterDeclaration,
        context: Context,
    ): BaseType | undefined {
        const args = context.getArguments();
        if (!args.length) {
            return undefined;
        }

        const parent = parameter.parent;
        if (!ts.isFunctionLike(parent)) {
            return undefined;
        }

        const index = parent.parameters.indexOf(parameter);
        if (index < 0 || index >= args.length) {
            return undefined;
        }

        return args[index];
    }

    /**
     * Resolves heritage targets to a node the parser chain can handle.
     * Factory mixins assign classes to const variables or return them from call expressions.
     */
    protected getHeritageDeclaration(symbol: ts.Symbol, expression: ts.Expression): ts.Node {
        const declarations = symbol.declarations ?? (symbol.valueDeclaration ? [symbol.valueDeclaration] : []);

        const classLike = declarations.find(
            (declaration) =>
                ts.isClassDeclaration(declaration) ||
                ts.isInterfaceDeclaration(declaration) ||
                ts.isTypeAliasDeclaration(declaration),
        );
        if (classLike) {
            return classLike;
        }

        const variableDecl = declarations.find(ts.isVariableDeclaration);
        if (variableDecl?.initializer) {
            return variableDecl.initializer;
        }

        const declaration = declarations[0];
        if (!declaration) {
            throw new UnknownNodeError(expression);
        }

        return declaration;
    }

    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}
