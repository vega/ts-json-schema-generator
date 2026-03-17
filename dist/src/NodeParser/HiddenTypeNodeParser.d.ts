import type ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class HiddenNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    constructor(typeChecker: ts.TypeChecker);
    supportsNode(node: ts.KeywordTypeNode): boolean;
    createType(_node: ts.KeywordTypeNode, _context: Context): BaseType;
}
