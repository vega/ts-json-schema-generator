import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class IntersectionNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.IntersectionTypeNode): boolean;
    createType(node: ts.IntersectionTypeNode, context: Context): BaseType;
}
