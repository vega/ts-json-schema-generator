import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectType } from "../Type/ObjectType";

export class ObjectTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    }
    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new ObjectType(`object-${node.getFullStart()}`, [], [], true);
    }
}
