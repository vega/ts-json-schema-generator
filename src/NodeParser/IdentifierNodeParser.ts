import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownNodeError } from "../Error/Errors.js";

/**
 * Resolves identifiers whose value is a compile-time constant or a class-like declaration.
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

        if (symbol.flags & ts.SymbolFlags.Alias) {
            return this.createTypeFromDeclaration(
                this.checker.getAliasedSymbol(symbol).valueDeclaration,
                context,
                node,
            );
        }

        return this.createTypeFromDeclaration(symbol.valueDeclaration, context, node);
    }

    protected createTypeFromDeclaration(
        decl: ts.Declaration | undefined,
        context: Context,
        node: ts.Identifier,
    ): BaseType {
        if (
            decl &&
            ts.isVariableDeclaration(decl) &&
            decl.initializer &&
            ts.getCombinedNodeFlags(decl) & ts.NodeFlags.Const
        ) {
            return this.childNodeParser.createType(decl.initializer, context);
        }

        if (
            decl &&
            (ts.isClassDeclaration(decl) ||
                ts.isInterfaceDeclaration(decl) ||
                ts.isTypeAliasDeclaration(decl))
        ) {
            return this.childNodeParser.createType(decl, context);
        }

        if (decl && ts.isParameter(decl)) {
            const parameterType = this.getConstructorParameterArgumentType(decl, context);
            if (parameterType) {
                return parameterType;
            }
        }

        throw new UnknownNodeError(node);
    }

    protected getConstructorParameterArgumentType(
        parameter: ts.ParameterDeclaration,
        context: Context,
    ): BaseType | undefined {
        const args = context.getArguments();
        if (!args.length) {
            return undefined;
        }

        const parent = parameter.parent;
        if (!ts.isFunctionLike(parent)) {
            return undefined;
        }

        const index = parent.parameters.indexOf(parameter);
        if (index < 0 || index >= args.length) {
            return undefined;
        }

        return args[index];
    }
}
