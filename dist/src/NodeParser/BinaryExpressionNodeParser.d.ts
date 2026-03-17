import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class BinaryExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.BinaryExpression, context: Context): BaseType;
    private isStringLike;
    private isBooleanLike;
    private isDefinitelyNumberLike;
}
