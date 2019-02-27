import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { VoidType } from "../Type/VoidType";

export class VoidKeywordTypeParser implements SubNodeParser {
    public supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    }
    public createType(node: ts.VoidExpression, context: Context): BaseType {
        return new VoidType();
    }
}
