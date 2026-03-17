import ts from "typescript";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { EnumValue } from "../Type/EnumType.js";
export declare class EnumNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    constructor(typeChecker: ts.TypeChecker);
    supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean;
    createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType;
    protected getMemberValue(member: ts.EnumMember, index: number): EnumValue;
    protected parseInitializer(initializer: ts.Node): EnumValue;
}
