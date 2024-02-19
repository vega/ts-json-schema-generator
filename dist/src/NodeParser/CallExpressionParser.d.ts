import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class CallExpressionParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.CallExpression): boolean;
    createType(node: ts.CallExpression, context: Context): BaseType;
    protected createSubContext(node: ts.CallExpression, parentContext: Context): Context;
}
