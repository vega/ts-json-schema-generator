import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
export declare class ParameterParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.ParameterDeclaration): boolean;
    createType(node: ts.FunctionTypeNode, context: Context): BaseType;
}
