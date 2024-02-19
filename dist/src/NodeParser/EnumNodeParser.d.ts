import ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumValue } from "../Type/EnumType";
export declare class EnumNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    constructor(typeChecker: ts.TypeChecker);
    supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean;
    createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType;
    protected getMemberValue(member: ts.EnumMember, index: number): EnumValue;
    protected parseInitializer(initializer: ts.Node): EnumValue;
}
