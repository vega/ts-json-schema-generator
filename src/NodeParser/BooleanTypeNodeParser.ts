import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";

export class BooleanTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new BooleanType();
    }
}
