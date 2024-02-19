import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
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
