import ts from "typescript";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { FunctionOptions } from "../Config.js";
import type { Context, NodeParser } from "../NodeParser.js";
import { ObjectType } from "../Type/ObjectType.js";
export declare class FunctionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected functions: FunctionOptions;
    constructor(childNodeParser: NodeParser, functions: FunctionOptions);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction, context: Context): BaseType;
}
export declare function getNamedArguments(childNodeParser: NodeParser, node: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction | ts.ConstructorTypeNode, context: Context): ObjectType | undefined;
export declare function getTypeName(node: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction | ts.ConstructorTypeNode): string | undefined;
