import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";

export class BooleanTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new BooleanType();
    }
}
