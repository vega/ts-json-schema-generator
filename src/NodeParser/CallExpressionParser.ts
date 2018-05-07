import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { TupleType } from "../Type/TupleType";
import { UnionType } from "../Type/UnionType";

export class CallExpressionParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.CallExpression): boolean {
        return node.kind === ts.SyntaxKind.CallExpression;
    }
    public createType(node: ts.CallExpression, context: Context): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);

        // FIXME: make this general
        return new TupleType([new UnionType(
            (type as any).typeArguments[0].types.map((t: any) => new LiteralType(t.value)),
        )]);
    }
}
