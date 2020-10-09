import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "./../Type/FunctionType";

/**
 * A function node parser that creates a function type so that mapped types can
 * use functions as values. There is no formatter for function types.
 */
export class FunctionNodeParser implements SubNodeParser {
    public supportsNode(node: ts.FunctionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.FunctionType;
    }
    public createType(): BaseType {
        return new FunctionType();
    }
}
