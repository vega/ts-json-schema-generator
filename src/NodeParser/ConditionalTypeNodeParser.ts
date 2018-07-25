import * as ts from "typescript";

import { SubNodeParser } from "../SubNodeParser";
import { Context, NodeParser } from "../NodeParser";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return (node.kind === ts.SyntaxKind.ConditionalType);
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType {
        // Wanted: Resolving the conditional type and somehow let the rest of
        // the generator do its magic
        const actualType = this.typeChecker.getTypeFromTypeNode(node);

        // Obviously wrong, just checking what happens
        return (new NullType());
    }
}
