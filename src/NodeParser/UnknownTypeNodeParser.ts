import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnknownType } from "../Type/UnknownType";

export class UnknownTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnknownKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new UnknownType();
    }
}
