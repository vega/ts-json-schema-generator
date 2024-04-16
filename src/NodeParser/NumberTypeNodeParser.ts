import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";

export class NumberTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.NumberKeyword || node.kind === ts.SyntaxKind.BigIntKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NumberType();
    }
}
