import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { referenceHidden } from "../Utils/isHidden";

export class UnionNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }
    public createType(node: ts.UnionTypeNode, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return new UnionType(
            node.types
                // TODO: in objects and interfaces, mark field as not required
                .filter((subnode: ts.Node) => subnode.kind !== ts.SyntaxKind.UndefinedKeyword)
                .filter((subnode: ts.Node) => !hidden(subnode))
                .map((subnode: ts.Node) => {
                    return this.childNodeParser.createType(subnode, context);
                }),
        );
    }
}
