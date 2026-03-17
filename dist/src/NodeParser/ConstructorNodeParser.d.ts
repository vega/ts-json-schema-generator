import ts from "typescript";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { FunctionOptions } from "../Config.js";
import type { Context, NodeParser } from "../NodeParser.js";
export declare class ConstructorNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected functions: FunctionOptions;
    constructor(childNodeParser: NodeParser, functions: FunctionOptions);
    supportsNode(node: ts.TypeNode): boolean;
    createType(node: ts.ConstructorTypeNode, context: Context): BaseType;
}
