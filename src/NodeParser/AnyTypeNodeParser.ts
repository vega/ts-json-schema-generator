import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";

export class AnyTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.AnyKeyword || node.kind === ts.SyntaxKind.SymbolKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new AnyType();
    }
}
