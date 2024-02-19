import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.ExpressionWithTypeArguments): boolean;
    createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType;
    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context;
}
