import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ConstructorType } from "../Type/ConstructorType";
import { FunctionOptions } from "../Config";
import { NeverType } from "../Type/NeverType";

export class ConstructorNodeParser implements SubNodeParser {
    constructor(private functions: FunctionOptions) {}

    public supportsNode(node: ts.ConstructorTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }
    public createType(node: ts.Node): BaseType {
        if (this.functions === "hide") {
            return new NeverType();
        }

        return new ConstructorType(<ts.ConstructorDeclaration>node);
    }
}
