import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { RestType } from "../Type/RestType.js";
/**
 * Handles `...expr` inside an ArrayLiteralExpression.
 * Turns it into RestType so TupleTypeFormatter can emit correct JSON-Schema.
 */
export declare class SpreadElementNodeParser implements SubNodeParser {
    private readonly childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.SpreadElement): boolean;
    createType(node: ts.SpreadElement, context: Context): RestType;
}
