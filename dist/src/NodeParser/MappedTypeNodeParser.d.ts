import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { EnumType } from "../Type/EnumType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NumberType } from "../Type/NumberType.js";
import { ObjectProperty } from "../Type/ObjectType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
export declare class MappedTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    constructor(childNodeParser: NodeParser, additionalProperties: boolean);
    supportsNode(node: ts.MappedTypeNode): boolean;
    createType(node: ts.MappedTypeNode, context: Context): BaseType;
    /**
     * In mapped types, questionToken can be:
     * - undefined: no optional modifier
     * - QuestionToken (?): add optional
     * - PlusToken (+?): add optional
     * - MinusToken (-?): remove optional (e.g. Required<T>) → property is required
     */
    protected isMappedPropertyRequired(node: ts.MappedTypeNode, hasUndefinedInType: boolean): boolean;
    protected mapKey(node: ts.MappedTypeNode, rawKey: LiteralType, context: Context): BaseType;
    protected getProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[];
    protected getValues(node: ts.MappedTypeNode, keyListType: EnumType, context: Context): ObjectProperty[];
    protected getAdditionalProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): BaseType | boolean;
    protected createSubContext(node: ts.MappedTypeNode, key: LiteralType | StringType | NumberType, parentContext: Context): Context;
}
