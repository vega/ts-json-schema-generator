import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { UnionType } from "../Type/UnionType";
import { BaseType } from "../Type/BaseType";
import { notNever } from "../Utils/notNever";
import { NeverType } from "../Type/NeverType";

export class UnionNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
    ) {}

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }

    public createType(node: ts.UnionTypeNode, context: Context): BaseType {
        const types = node.types
            .map((subnode) => {
                return this.childNodeParser.createType(subnode, context);
            })
            .filter(notNever);

        if (types.length === 1) {
            return types[0];
        } else if (types.length === 0) {
            return new NeverType();
        }

        return new UnionType(types);
    }
}
