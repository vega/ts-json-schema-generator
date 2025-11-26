import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class ParameterParser implements SubNodeParser {
    constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ParameterDeclaration): boolean {
        return node.kind === ts.SyntaxKind.Parameter;
    }
    public createType(node: ts.FunctionTypeNode, context: Context): BaseType {
        return this.childNodeParser.createType(node.type, context);
    }
}
