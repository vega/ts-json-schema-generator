import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { LiteralType } from "../Type/LiteralType";
import { ObjectProperty } from "../Type/ObjectType";
import { StringType } from "../Type/StringType";
import { UnionType } from "../Type/UnionType";
export declare class MappedTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    constructor(childNodeParser: NodeParser, additionalProperties: boolean);
    supportsNode(node: ts.MappedTypeNode): boolean;
    createType(node: ts.MappedTypeNode, context: Context): BaseType;
    protected mapKey(node: ts.MappedTypeNode, rawKey: LiteralType, context: Context): BaseType;
    protected getProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[];
    protected getValues(node: ts.MappedTypeNode, keyListType: EnumType, context: Context): ObjectProperty[];
    protected getAdditionalProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): BaseType | boolean;
    protected createSubContext(node: ts.MappedTypeNode, key: LiteralType | StringType, parentContext: Context): Context;
}
