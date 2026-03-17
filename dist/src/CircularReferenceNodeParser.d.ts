import type ts from "typescript";
import type { Context } from "./NodeParser.js";
import type { SubNodeParser } from "./SubNodeParser.js";
import type { BaseType } from "./Type/BaseType.js";
export declare class CircularReferenceNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    protected circular: Map<string, BaseType>;
    constructor(childNodeParser: SubNodeParser);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
}
