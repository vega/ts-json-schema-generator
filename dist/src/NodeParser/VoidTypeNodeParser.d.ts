import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class VoidTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts.KeywordTypeNode): boolean;
    createType(node: ts.KeywordTypeNode, context: Context): BaseType;
}
