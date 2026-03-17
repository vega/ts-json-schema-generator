import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class TypeAliasNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeAliasDeclaration): boolean;
    createType(node: ts.TypeAliasDeclaration, context: Context, reference?: ReferenceType): BaseType;
    protected getTypeId(node: ts.TypeAliasDeclaration, context: Context): string;
    protected getTypeName(node: ts.TypeAliasDeclaration, context: Context): string;
}
