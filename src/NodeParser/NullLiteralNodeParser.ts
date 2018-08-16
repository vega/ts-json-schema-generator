import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";

export class NullLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.NullLiteral): boolean {
        return node.kind === ts.SyntaxKind.NullKeyword;
    }
    public createType(node: ts.NullLiteral, context: Context): BaseType {
        return new NullType();
    }
}
