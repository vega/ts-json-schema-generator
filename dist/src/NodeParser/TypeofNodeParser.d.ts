import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectType } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class TypeofNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeQueryNode): boolean;
    createType(node: ts.TypeQueryNode, context: Context, reference?: ReferenceType): BaseType;
    protected createObjectFromEnum(node: ts.EnumDeclaration, context: Context, reference?: ReferenceType): ObjectType;
}
