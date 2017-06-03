import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }
    public createType(node: ts.IntersectionTypeNode, context: Context): BaseType {
        return new IntersectionType(
            node.types.map((subnode: ts.Node) => {
                return this.childNodeParser.createType(subnode, context);
            }),
        );
    }
}
