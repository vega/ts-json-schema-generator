import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { TupleType } from "../Type/TupleType.js";

export class TupleNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.TupleTypeNode): boolean {
        return node.kind === ts.SyntaxKind.TupleType;
    }

    public createType(node: ts.TupleTypeNode, context: Context): BaseType {
        return new TupleType(
            node.elements.map((item) => {
                return this.childNodeParser.createType(item, context);
            }),
        );
    }
}
