import type { PropertyName } from "typescript";
import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { ObjectProperty } from "../Type/ObjectType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class InterfaceAndClassNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, additionalProperties: boolean);
    supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean;
    createType(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context, reference?: ReferenceType): BaseType;
    /**
     * If specified node extends Array or ReadonlyArray and nothing else then this method returns the
     * array item type. In all other cases null is returned to indicate that the node is not a simple array.
     *
     * @param node - The interface or class to check.
     * @return The array item type if node is an array, null otherwise.
     */
    protected getArrayItemType(node: ts.InterfaceDeclaration | ts.ClassDeclaration): ts.TypeNode | null;
    protected getBaseTypes(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType[];
    protected getProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): ObjectProperty[] | undefined;
    protected getAdditionalProperties(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context): BaseType | boolean;
    protected getTypeId(node: ts.Node, context: Context): string;
    protected getPropertyName(propertyName: PropertyName): string;
}
