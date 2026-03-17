import ts from "typescript";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
/**
 * Needs to be registered before 261, 260, 230, 262 node kinds
 */
export declare class PromiseNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.ExpressionWithTypeArguments | ts.TypeAliasDeclaration, context: Context): BaseType;
    private getNodeName;
}
