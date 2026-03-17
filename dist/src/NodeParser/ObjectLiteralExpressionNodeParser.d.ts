import type { NodeParser } from "../NodeParser.js";
import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class ObjectLiteralExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected checker: ts.TypeChecker;
    constructor(childNodeParser: NodeParser, checker: ts.TypeChecker);
    supportsNode(node: ts.ObjectLiteralExpression): boolean;
    createType(node: ts.ObjectLiteralExpression, context: Context): BaseType;
    private parseProperties;
}
