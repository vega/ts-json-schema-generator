import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";

export class ArrayNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ArrayTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ArrayType;
    }

    public createType(node: ts.ArrayTypeNode, context: Context): BaseType | undefined {
        const type = this.childNodeParser.createType(node.elementType, context);
        return type && new ArrayType(type);
    }
}
