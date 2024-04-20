import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { UnionType } from "../Type/UnionType.js";
import { BaseType } from "../Type/BaseType.js";
import { notNever } from "../Utils/notNever.js";
import { NeverType } from "../Type/NeverType.js";
import { notUndefined } from "../Utils/notUndefined.js";

export class UnionNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }

    public createType(node: ts.UnionTypeNode, context: Context): BaseType {
        const types = node.types
            .map((subnode) => {
                return this.childNodeParser.createType(subnode, context);
            })
            .filter(notNever)
            .filter(notUndefined);

        if (types.length === 1) {
            return types[0];
        } else if (types.length === 0) {
            return new NeverType();
        }

        return new UnionType(types);
    }
}
