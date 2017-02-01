import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnyType } from "../Type/AnyType";

export class AnyTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.AnyKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new AnyType();
    }
}
