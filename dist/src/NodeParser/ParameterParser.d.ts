import ts from "typescript";
import { NodeParser } from "../NodeParser";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class ParameterParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.ParameterDeclaration): boolean;
    createType(node: ts.FunctionTypeNode, context: Context): BaseType;
}
