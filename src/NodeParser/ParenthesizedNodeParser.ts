import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";

export class ParenthesizedNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ParenthesizedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ParenthesizedType;
    }
    public createType(node: ts.ParenthesizedTypeNode, context: Context): BaseType {
        return this.childNodeParser.createType(node.type, context);
    }
}
