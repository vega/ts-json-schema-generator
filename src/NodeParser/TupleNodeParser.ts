import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { TupleType } from "../Type/TupleType";
import { referenceHidden } from "../Utils/isHidden";

export class TupleNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TupleTypeNode): boolean {
        return node.kind === ts.SyntaxKind.TupleType;
    }
    public createType(node: ts.TupleTypeNode, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return new TupleType(
            node.elementTypes
                .filter((subnode: ts.Node) => !hidden(subnode))
                .map((item: ts.TypeNode) => {
                    return this.childNodeParser.createType(item, context);
                }),
        );
    }
}
