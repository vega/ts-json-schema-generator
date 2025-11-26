import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";

export class NumberTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.NumberKeyword || node.kind === ts.SyntaxKind.BigIntKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NumberType();
    }
}
