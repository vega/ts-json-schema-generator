import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ConstructorType } from "../Type/ConstructorType";

/**
 * A constructor node parser that creates a constructor type so that mapped
 * types can use constructors as values. There is no formatter for constructor
 * types.
 */
export class ConstructorNodeParser implements SubNodeParser {
    public supportsNode(node: ts.ConstructorTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }
    public createType(): BaseType {
        return new ConstructorType();
    }
}
