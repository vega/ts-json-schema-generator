import ts, { PropertyName } from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty } from "../Type/ObjectType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class InterfaceAndClassNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, additionalProperties: boolean);
    supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean;
    createType(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context, reference?: ReferenceType): BaseType;
    protected getArrayItemType(node: ts.InterfaceDeclaration | ts.ClassDeclaration): ts.TypeNode | null;
    protected getBaseTypes(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType[];
    protected getProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): ObjectProperty[] | undefined;
    protected getAdditionalProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType | boolean;
    protected getTypeId(node: ts.Node, context: Context): string;
    protected getPropertyName(propertyName: PropertyName): string;
}
