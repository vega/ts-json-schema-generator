import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
export declare class TypeOperatorNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.TypeOperatorNode): boolean;
    createType(node: ts.TypeOperatorNode, context: Context): BaseType;
}
