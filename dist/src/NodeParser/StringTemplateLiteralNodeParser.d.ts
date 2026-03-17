import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class StringTemplateLiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode): boolean;
    createType(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode, context: Context): BaseType;
}
