import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { RestType } from "../Type/RestType";

export class RestTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }
    public supportsNode(node: ts.RestTypeNode): boolean {
        return node.kind === ts.SyntaxKind.RestType;
    }
    public createType(node: ts.RestTypeNode, context: Context): BaseType {
        return new RestType(
            this.childNodeParser.createType(node.type, context) as ArrayType,
        );
    }
}
