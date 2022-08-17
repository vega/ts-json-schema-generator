import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ParenthesizedNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ParenthesizedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ParenthesizedType;
    }
    public createType(node: ts.ParenthesizedTypeNode, context: Context): BaseType {
        return this.childNodeParser.createType(node.type, context);
    }
}
