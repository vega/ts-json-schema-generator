import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class NullLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.NullLiteral): boolean;
    createType(node: ts.NullLiteral, context: Context): BaseType;
}
