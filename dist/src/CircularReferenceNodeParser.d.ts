import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
export declare class CircularReferenceNodeParser implements SubNodeParser {
    private childNodeParser;
    private circular;
    constructor(childNodeParser: SubNodeParser);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
    private createCacheKey(node, context);
}
