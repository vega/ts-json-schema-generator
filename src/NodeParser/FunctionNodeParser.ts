import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";
import { FunctionOptions } from "../Config";
import { NeverType } from "../Type/NeverType";

export class FunctionNodeParser implements SubNodeParser {
    constructor(private functions: FunctionOptions) {}

    public supportsNode(node: ts.FunctionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.FunctionType || node.kind === ts.SyntaxKind.ArrowFunction;
    }

    public createType(node: ts.Node): BaseType {
        if (this.functions === "hide") {
            return new NeverType();
        }

        return new FunctionType(<ts.FunctionDeclaration>node);
    }
}
