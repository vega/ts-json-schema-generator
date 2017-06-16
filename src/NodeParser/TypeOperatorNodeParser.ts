import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType, EnumValue } from "../Type/EnumType";

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
        const type: ts.Type = this.typeChecker.getTypeFromTypeNode(node);
        return new EnumType(
            `keyof-type-${node.getFullStart()}`,
            (<any>type).types.map((t: any) => t.text),
        );
    }
}
