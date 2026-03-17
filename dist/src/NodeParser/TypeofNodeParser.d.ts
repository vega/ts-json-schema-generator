import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { ObjectType } from "../Type/ObjectType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class TypeofNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.TypeQueryNode): boolean;
    createType(node: ts.TypeQueryNode, context: Context, reference?: ReferenceType): BaseType;
    protected createObjectFromEnum(node: ts.EnumDeclaration, context: Context, reference?: ReferenceType): ObjectType;
}
