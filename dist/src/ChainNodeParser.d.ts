import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
export declare class ChainNodeParser implements SubNodeParser {
    private typeChecker;
    private nodeParsers;
    constructor(typeChecker: ts.TypeChecker, nodeParsers: SubNodeParser[]);
    addNodeParser(nodeParser: SubNodeParser): this;
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
    private getNodeParser(node, context);
}
