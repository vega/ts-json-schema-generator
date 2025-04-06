import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { InferType } from "../Type/InferType.js";

export class InferTypeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.InferTypeNode): boolean {
        return node.kind === ts.SyntaxKind.InferType;
    }

    public createType(node: ts.InferTypeNode, _context: Context): BaseType {
        return new InferType(node.typeParameter.name.escapedText.toString());
    }
}
