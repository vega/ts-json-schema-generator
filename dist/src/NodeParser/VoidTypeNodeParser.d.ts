import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class VoidTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts.KeywordTypeNode): boolean;
    createType(node: ts.KeywordTypeNode, context: Context): BaseType;
}
