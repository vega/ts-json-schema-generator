import ts from "typescript";
import { NodeParser } from "../NodeParser";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ParameterParser implements SubNodeParser {
    constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ParameterDeclaration): boolean {
        return node.kind === ts.SyntaxKind.Parameter;
    }
    public createType(node: ts.FunctionTypeNode, context: Context): BaseType | undefined {
        return this.childNodeParser.createType(node.type, context);
    }
}
