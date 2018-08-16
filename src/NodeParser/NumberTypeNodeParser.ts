import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NumberType } from "../Type/NumberType";

export class NumberTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.NumberKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NumberType();
    }
}
