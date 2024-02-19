import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
declare class CheckType {
    parameterName: string;
    type: BaseType;
    constructor(parameterName: string, type: BaseType);
}
export declare class ConditionalTypeNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.ConditionalTypeNode): boolean;
    createType(node: ts.ConditionalTypeNode, context: Context): BaseType;
    protected getTypeParameterName(node: ts.TypeNode): string | null;
    protected createSubContext(node: ts.ConditionalTypeNode, parentContext: Context, checkType?: CheckType, inferMap?: Map<string, BaseType>): Context;
}
export {};
