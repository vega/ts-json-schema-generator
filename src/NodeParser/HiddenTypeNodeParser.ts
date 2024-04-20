import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { HiddenType } from "../Type/HiddenType.js";
import { isNodeHidden } from "../Utils/isHidden.js";

export class HiddenNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return isNodeHidden(node);
    }

    public createType(_node: ts.KeywordTypeNode, _context: Context): BaseType {
        return new HiddenType();
    }
}
