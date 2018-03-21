import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.ExpressionWithTypeArguments): boolean;
    createType(node: ts.ExpressionWithTypeArguments, context: Context): BaseType;
    private createSubContext(node, parentContext);
}
