import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { UnionType } from "../Type/UnionType";
import { BaseType } from "../Type/BaseType";
import { notUndefined } from "../Utils/notUndefined";

export class UnionNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }
    public createType(node: ts.UnionTypeNode, context: Context): BaseType {
        const types = node.types
            .map(subnode => {
                return this.childNodeParser.createType(subnode, context);
            })
            .filter(notUndefined);
        return new UnionType(types);
    }
}
