import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";

export class BooleanTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new BooleanType();
    }
}
