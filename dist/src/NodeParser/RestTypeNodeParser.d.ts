import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class RestTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.RestTypeNode): boolean;
    createType(node: ts.RestTypeNode, context: Context): BaseType;
}
