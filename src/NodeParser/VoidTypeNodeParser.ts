import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { VoidType } from "../Type/VoidType";

export class VoidTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new VoidType();
    }
}
