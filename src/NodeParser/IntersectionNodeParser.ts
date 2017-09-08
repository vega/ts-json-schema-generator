import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { referenceHidden } from "../Utils/isHidden";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }
    public createType(node: ts.IntersectionTypeNode, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return new IntersectionType(
            node.types
                .filter((subnode: ts.Node) => !hidden(subnode))
                .map((subnode: ts.Node) => {
                    return this.childNodeParser.createType(subnode, context);
                }),
        );
    }
}
