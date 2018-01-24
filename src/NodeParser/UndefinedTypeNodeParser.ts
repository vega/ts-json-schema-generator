import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UndefinedType } from "../Type/UndefinedType";

export class UndefinedTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new UndefinedType();
    }
}
