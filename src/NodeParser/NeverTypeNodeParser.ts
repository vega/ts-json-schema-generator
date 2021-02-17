import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class NeverTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.NeverKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType | undefined {
        return undefined;
    }
}
