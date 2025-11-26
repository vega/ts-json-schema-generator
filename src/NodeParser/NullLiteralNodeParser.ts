import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { NullType } from "../Type/NullType.js";

export class NullLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.NullLiteral): boolean {
        return node.kind === ts.SyntaxKind.NullKeyword;
    }
    public createType(node: ts.NullLiteral, context: Context): BaseType {
        return new NullType();
    }
}
