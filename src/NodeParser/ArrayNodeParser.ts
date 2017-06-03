import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";

export class ArrayNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.ArrayTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ArrayType;
    }
    public createType(node: ts.ArrayTypeNode, context: Context): BaseType {
        return new ArrayType(
            this.childNodeParser.createType(node.elementType, context),
        );
    }
}
