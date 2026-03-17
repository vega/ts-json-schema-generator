import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class PropertyAccessExpressionParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.PropertyAccessExpression): boolean;
    createType(node: ts.PropertyAccessExpression, context: Context): BaseType;
}
