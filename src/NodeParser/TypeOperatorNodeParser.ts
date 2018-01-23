import * as ts from "typescript";
import { UnionType } from "../..";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { getTypeKeys } from "../Utils/typeKeys";

export class TypeOperatorNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeOperatorNode): boolean {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }

    public createType(node: ts.TypeOperatorNode, context: Context): BaseType {
        const type = this.childNodeParser.createType(node.type, context);
        const keys = getTypeKeys(type);

        return new UnionType(keys);
    }
}
