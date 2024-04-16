import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { UnknownType } from "../Type/UnknownType.js";

export class UnknownTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnknownKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new UnknownType();
    }
}
