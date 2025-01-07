import type ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
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
