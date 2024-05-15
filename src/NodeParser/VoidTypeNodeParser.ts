import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { VoidType } from "../Type/VoidType.js";

export class VoidTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new VoidType();
    }
}
