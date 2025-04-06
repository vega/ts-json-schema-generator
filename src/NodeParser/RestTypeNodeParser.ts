import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { InferType } from "../Type/InferType.js";
import { RestType } from "../Type/RestType.js";
import type { TupleType } from "../Type/TupleType.js";

export class RestTypeNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}
    public supportsNode(node: ts.RestTypeNode): boolean {
        return node.kind === ts.SyntaxKind.RestType;
    }
    public createType(node: ts.RestTypeNode, context: Context): BaseType {
        return new RestType(this.childNodeParser.createType(node.type, context) as ArrayType | InferType | TupleType);
    }
}
