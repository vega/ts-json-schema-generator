import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { ArrayType } from "../Type/ArrayType.js";
import type { InferType } from "../Type/InferType.js";
import type { TupleType } from "../Type/TupleType.js";
import { RestType } from "../Type/RestType.js";

/**
 * Handles `...expr` inside an ArrayLiteralExpression.
 * Turns it into RestType so TupleTypeFormatter can emit correct JSON-Schema.
 */
export class SpreadElementNodeParser implements SubNodeParser {
    constructor(private readonly childNodeParser: NodeParser) {}

    supportsNode(node: ts.SpreadElement): boolean {
        return node.kind === ts.SyntaxKind.SpreadElement;
    }

    createType(node: ts.SpreadElement, context: Context) {
        const inner = this.childNodeParser.createType(node.expression, context) as ArrayType | InferType | TupleType;

        return new RestType(inner);
    }
}
