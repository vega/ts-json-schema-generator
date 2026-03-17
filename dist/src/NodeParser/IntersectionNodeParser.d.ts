import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class IntersectionNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.IntersectionTypeNode): boolean;
    createType(node: ts.IntersectionTypeNode, context: Context): BaseType;
}
/**
 * Translates the given intersection type into a union type if necessary so `A & (B | C)` becomes
 * `(A & B) | (A & C)`. If no translation is needed then the original intersection type is returned.
 */
export declare function translate(types: BaseType[]): BaseType;
