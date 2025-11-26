import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { StringType } from "../Type/StringType.js";

export class StringTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.StringKeyword;
    }

    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new StringType();
    }
}
