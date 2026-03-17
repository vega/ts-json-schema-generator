import ts from "typescript";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class TypeReferenceNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeReferenceNode): boolean;
    createType(node: ts.TypeReferenceNode, context: Context): BaseType;
    protected createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context;
}
