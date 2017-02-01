import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { NameParser } from "../NameParser";
import { BaseType } from "../Type/BaseType";

export class TypeQueryNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
    ) {
    }

    public supportsNode(node: ts.TypeQueryNode): boolean {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }
    public createType(node: ts.TypeQueryNode, context: Context): BaseType {
        const type: ts.Type = this.typeChecker.getTypeAtLocation(node);
        return undefined;
    }
}
