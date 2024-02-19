import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class IntersectionNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.IntersectionTypeNode): boolean;
    createType(node: ts.IntersectionTypeNode, context: Context): BaseType;
}
export declare function translate(types: BaseType[]): BaseType;
