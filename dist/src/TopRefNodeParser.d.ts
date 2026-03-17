import type ts from "typescript";
import type { Context, NodeParser } from "./NodeParser.js";
import type { BaseType } from "./Type/BaseType.js";
export declare class TopRefNodeParser implements NodeParser {
    protected childNodeParser: NodeParser;
    protected fullName: string | undefined;
    protected topRef: boolean;
    constructor(childNodeParser: NodeParser, fullName: string | undefined, topRef: boolean);
    createType(node: ts.Node, context: Context): BaseType;
}
