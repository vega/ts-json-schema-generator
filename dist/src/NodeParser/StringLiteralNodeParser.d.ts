import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class StringLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.StringLiteral): boolean;
    createType(node: ts.StringLiteral, context: Context): BaseType;
}
