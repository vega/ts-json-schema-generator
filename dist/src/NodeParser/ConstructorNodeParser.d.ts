import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class ConstructorNodeParser implements SubNodeParser {
    supportsNode(node: ts.ConstructorTypeNode): boolean;
    createType(): BaseType;
}
