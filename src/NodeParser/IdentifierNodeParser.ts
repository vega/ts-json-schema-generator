import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownNodeError } from "../Error/Errors.js";

/**
 * Resolves identifiers whose value is a compile-time constant
 */
export class IdentifierNodeParser implements SubNodeParser {
    constructor(
        private readonly childNodeParser: NodeParser,
        private readonly checker: ts.TypeChecker,
    ) {}

    supportsNode(node: ts.Identifier): boolean {
        return node.kind === ts.SyntaxKind.Identifier;
    }

    createType(node: ts.Identifier, context: Context): BaseType {
        const symbol = this.checker.getSymbolAtLocation(node);
        if (!symbol) {
            throw new UnknownNodeError(node);
        }

        const decl = symbol.valueDeclaration;
        if (
            decl &&
            ts.isVariableDeclaration(decl) &&
            decl.initializer &&
            ts.getCombinedNodeFlags(decl) & ts.NodeFlags.Const
        ) {
            return this.childNodeParser.createType(decl.initializer, context);
        }

        throw new UnknownNodeError(node);
    }
}
