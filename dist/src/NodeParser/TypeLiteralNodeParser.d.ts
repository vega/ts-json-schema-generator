import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { ObjectProperty } from "../Type/ObjectType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class TypeLiteralNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, additionalProperties: boolean);
    supportsNode(node: ts.TypeLiteralNode): boolean;
    createType(node: ts.TypeLiteralNode, context: Context, reference?: ReferenceType): BaseType;
    protected getProperties(node: ts.TypeLiteralNode, context: Context): ObjectProperty[] | undefined;
    protected getAdditionalProperties(node: ts.TypeLiteralNode, context: Context): BaseType | boolean;
    protected getTypeId(node: ts.Node, context: Context): string;
    protected getPropertyName(propertyName: ts.PropertyName): string;
}
