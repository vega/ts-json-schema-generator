import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { InferType } from "../Type/InferType.js";

export class InferTypeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
    ) {}

    public supportsNode(node: ts.InferTypeNode): boolean {
        return node.kind === ts.SyntaxKind.InferType;
    }

    public createType(node: ts.InferTypeNode, _context: Context): BaseType {
        return new InferType(node.typeParameter.name.escapedText.toString());
    }
}
