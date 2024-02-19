import { NodeParser } from "../NodeParser";
import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class AsExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.AsExpression): boolean;
    createType(node: ts.AsExpression, context: Context): BaseType;
}
