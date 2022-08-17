import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";
import { isNodeHidden } from "../Utils/isHidden";

export class HiddenNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return isNodeHidden(node);
    }

    public createType(_node: ts.KeywordTypeNode, _context: Context): BaseType {
        return new NeverType();
    }
}
