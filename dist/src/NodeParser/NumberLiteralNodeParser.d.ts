import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class NumberLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.NumericLiteral): boolean;
    createType(node: ts.NumericLiteral, context: Context): BaseType;
}
