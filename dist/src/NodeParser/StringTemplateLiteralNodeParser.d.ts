import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class StringTemplateLiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode): boolean;
    createType(node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode, context: Context): BaseType;
}
