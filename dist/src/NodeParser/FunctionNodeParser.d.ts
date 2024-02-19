import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class FunctionNodeParser implements SubNodeParser {
    supportsNode(node: ts.FunctionTypeNode): boolean;
    createType(): BaseType;
}
