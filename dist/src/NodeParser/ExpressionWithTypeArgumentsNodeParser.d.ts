import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.ExpressionWithTypeArguments): boolean;
    createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType;
    protected createTypeFromSymbol(typeSymbol: ts.Symbol, expression: ts.Expression, subContext: Context, context: Context): BaseType;
    protected getParseContext(declaration: ts.Node, subContext: Context, context: Context): Context;
    protected getConstructorParameterArgumentType(parameter: ts.ParameterDeclaration, context: Context): BaseType | undefined;
    /**
     * Resolves heritage targets to a node the parser chain can handle.
     * Factory mixins assign classes to const variables or return them from call expressions.
     */
    protected getHeritageDeclaration(symbol: ts.Symbol, expression: ts.Expression): ts.Node;
    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context;
}
