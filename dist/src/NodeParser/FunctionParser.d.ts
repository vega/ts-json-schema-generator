import ts from "typescript";
import { NodeParser } from "../NodeParser";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { DefinitionType } from "../Type/DefinitionType";
export declare class FunctionParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression): boolean;
    createType(node: ts.FunctionDeclaration | ts.ArrowFunction, context: Context): DefinitionType;
    getTypeName(node: ts.FunctionDeclaration | ts.ArrowFunction, context: Context): string;
}
