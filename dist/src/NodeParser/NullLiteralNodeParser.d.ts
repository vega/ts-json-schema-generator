import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class NullLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts.NullLiteral): boolean;
    createType(node: ts.NullLiteral, context: Context): BaseType;
}
