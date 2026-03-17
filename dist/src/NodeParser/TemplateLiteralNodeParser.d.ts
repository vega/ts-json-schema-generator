import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class TemplateLiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode): boolean;
    createType(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode, context: Context): BaseType;
    protected expandTypes(types: BaseType[]): BaseType;
}
