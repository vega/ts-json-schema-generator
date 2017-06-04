import * as ts from "typescript";
import { NodeParser, Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class VariableDeclarationNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.VariableDeclaration): boolean;
    createType(node: ts.VariableDeclaration, context: Context): BaseType;
}
