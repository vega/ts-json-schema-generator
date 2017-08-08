import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class NumberLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.NumericLiteral): boolean;
    createType(node: ts.NumericLiteral, context: Context): BaseType;
}
