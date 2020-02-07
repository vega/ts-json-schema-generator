import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { isHidden } from "../Utils/isHidden";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class HiddenNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker) {}

    public supportsNode(node: ts.KeywordTypeNode): boolean {
        const symbol = symbolAtNode(node);
        if (symbol) {
            return isHidden(symbol);
        }
        return false;
    }

    public createType(node: ts.KeywordTypeNode, context: Context): BaseType | undefined {
        return undefined;
    }
}
