import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class HiddenNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    constructor(typeChecker: ts.TypeChecker);
    supportsNode(node: ts.KeywordTypeNode): boolean;
    createType(_node: ts.KeywordTypeNode, _context: Context): BaseType;
}
