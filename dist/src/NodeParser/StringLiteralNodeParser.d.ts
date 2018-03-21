import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class StringLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.StringLiteral): boolean;
    createType(node: ts.StringLiteral, context: Context): BaseType;
}
