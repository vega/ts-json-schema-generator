import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class BooleanLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.BooleanLiteral): boolean;
    createType(node: ts.BooleanLiteral, context: Context): BaseType;
}
