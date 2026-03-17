import type { NodeParser } from "../NodeParser.js";
import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class AsExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.AsExpression): boolean;
    createType(node: ts.AsExpression, context: Context): BaseType;
}
