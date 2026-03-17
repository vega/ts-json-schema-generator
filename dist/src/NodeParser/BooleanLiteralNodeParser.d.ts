import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class BooleanLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.BooleanLiteral): boolean;
    createType(node: ts.BooleanLiteral, context: Context): BaseType;
}
