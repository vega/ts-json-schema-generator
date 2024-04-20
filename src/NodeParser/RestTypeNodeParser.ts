import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";
import { InferType } from "../Type/InferType.js";
import { RestType } from "../Type/RestType.js";
import { TupleType } from "../Type/TupleType.js";

export class RestTypeNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}
    public supportsNode(node: ts.RestTypeNode): boolean {
        return node.kind === ts.SyntaxKind.RestType;
    }
    public createType(node: ts.RestTypeNode, context: Context): BaseType {
        return new RestType(this.childNodeParser.createType(node.type, context) as ArrayType | InferType | TupleType);
    }
}
