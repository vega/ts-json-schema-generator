import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class TypeLiteralNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.TypeLiteralNode): boolean;
    createType(node: ts.TypeLiteralNode, context: Context): BaseType;
    private getProperties(node, context);
    private getAdditionalProperties(node, context);
}
