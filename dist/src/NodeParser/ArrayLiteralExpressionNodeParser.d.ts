import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class ArrayLiteralExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.ArrayLiteralExpression): boolean;
    createType(node: ts.ArrayLiteralExpression, context: Context): BaseType;
}
