import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class EnumNodeParser implements SubNodeParser {
    private typeChecker;
    constructor(typeChecker: ts.TypeChecker);
    supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean;
    createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType;
    private getMemberValue(member, index);
    private parseInitializer(initializer);
}
