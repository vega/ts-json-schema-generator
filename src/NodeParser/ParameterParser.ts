import ts from "typescript";
import { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";

export class ParameterParser implements SubNodeParser {
    constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ParameterDeclaration): boolean {
        return node.kind === ts.SyntaxKind.Parameter;
    }
    public createType(node: ts.FunctionTypeNode, context: Context): BaseType | undefined {
        return this.childNodeParser.createType(node.type, context);
    }
}
