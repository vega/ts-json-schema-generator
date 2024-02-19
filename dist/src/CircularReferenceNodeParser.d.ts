import ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
export declare class CircularReferenceNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    protected circular: Map<string, BaseType>;
    constructor(childNodeParser: SubNodeParser);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
}
