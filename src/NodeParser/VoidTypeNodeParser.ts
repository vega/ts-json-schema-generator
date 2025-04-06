import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { VoidType } from "../Type/VoidType.js";

export class VoidTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new VoidType();
    }
}
