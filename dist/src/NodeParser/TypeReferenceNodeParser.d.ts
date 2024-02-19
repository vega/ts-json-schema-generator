import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import type { SubNodeParser } from "../SubNodeParser";
import type { BaseType } from "../Type/BaseType";
export declare class TypeReferenceNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeReferenceNode): boolean;
    createType(node: ts.TypeReferenceNode, context: Context): BaseType;
    protected createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context;
}
