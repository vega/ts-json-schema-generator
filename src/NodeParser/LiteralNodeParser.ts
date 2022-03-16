import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class LiteralNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.LiteralTypeNode): boolean {
        return node.kind === ts.SyntaxKind.LiteralType;
    }
    public createType(node: ts.LiteralTypeNode, context: Context): BaseType | undefined {
        return this.childNodeParser.createType(node.literal, context);
    }
}
