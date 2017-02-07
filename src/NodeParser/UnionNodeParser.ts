import * as ts from "typescript";
import { NodeParser, Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";

export class UnionNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }
    public createType(node: ts.UnionTypeNode, context: Context): BaseType {
        return new UnionType(
            node.types.map((subnode: ts.Node) => {
                return this.childNodeParser.createType(subnode, context);
            }),
        );
    }
}
