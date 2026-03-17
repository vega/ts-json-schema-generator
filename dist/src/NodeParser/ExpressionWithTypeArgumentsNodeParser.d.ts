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
    protected createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context;
}
