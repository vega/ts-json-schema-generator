import ts from "typescript";
import { Context } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { ObjectType } from "../Type/ObjectType.js";
import { getKey } from "../Utils/nodeKey.js";

export class ObjectTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    }

    public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new ObjectType(`object-${getKey(node, context)}`, [], [], true, true);
    }
}
