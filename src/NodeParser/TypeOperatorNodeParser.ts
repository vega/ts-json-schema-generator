import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { getTypeKeys } from "../Utils/typeKeys";

export class TypeOperatorNodeParser implements SubNodeParser {
    public constructor(
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
