import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class TypeAliasNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeAliasDeclaration): boolean;
    createType(node: ts.TypeAliasDeclaration, context: Context, reference?: ReferenceType): BaseType;
    protected getTypeId(node: ts.TypeAliasDeclaration, context: Context): string;
    protected getTypeName(node: ts.TypeAliasDeclaration, context: Context): string;
}
