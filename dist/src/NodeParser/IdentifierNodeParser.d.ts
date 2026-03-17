import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
/**
 * Resolves identifiers whose value is a compile-time constant
 */
export declare class IdentifierNodeParser implements SubNodeParser {
    private readonly childNodeParser;
    private readonly checker;
    constructor(childNodeParser: NodeParser, checker: ts.TypeChecker);
    supportsNode(node: ts.Identifier): boolean;
    createType(node: ts.Identifier, context: Context): BaseType;
}
