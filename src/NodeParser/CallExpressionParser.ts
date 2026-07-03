import { TupleType } from "../Type/TupleType.js";
import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { SymbolType } from "../Type/SymbolType.js";
import { UnknownNodeError } from "../Error/Errors.js";

export class CallExpressionParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.CallExpression): boolean {
        return node.kind === ts.SyntaxKind.CallExpression;
    }
    public createType(node: ts.CallExpression, context: Context): BaseType {
        const subContext = this.createSubContext(node, context);
        const factoryReturnClass = this.getFactoryReturnClass(node);
        if (factoryReturnClass) {
            return this.childNodeParser.createType(factoryReturnClass, subContext);
        }

        const type = this.typeChecker.getTypeAtLocation(node);

        // FIXME: remove special case
        if (Array.isArray((type as any)?.typeArguments?.[0]?.types)) {
            return new TupleType([
                new UnionType((type as any).typeArguments[0].types.map((t: any) => new LiteralType(t.value))),
            ]);
        }

        // A call expression like Symbol("entity") that resulted in a `unique symbol`
        if (type.flags === ts.TypeFlags.UniqueESSymbol) {
            return new SymbolType();
        }

        const symbol = type.symbol || type.aliasSymbol;

        // For funtions like <T>(type: T) => T, there won't be any reference to the original
        // type. Using type checker to infer the actual return type without mapping the whole
        // function and back referencing its generic type based on parameter index is a better
        // approach.
        const decl =
            this.typeChecker.typeToTypeNode(type, node, ts.NodeBuilderFlags.IgnoreErrors) ||
            symbol?.valueDeclaration ||
            symbol?.declarations?.[0];

        if (!decl) {
            throw new UnknownNodeError(node);
        }

        return this.childNodeParser.createType(decl, subContext);
    }

    protected getFactoryReturnClass(
        node: ts.CallExpression,
    ): ts.ClassDeclaration | ts.ClassExpression | undefined {
        const callee = node.expression;
        if (!ts.isIdentifier(callee)) {
            return undefined;
        }

        const symbol = this.typeChecker.getSymbolAtLocation(callee);
        const fn = symbol?.valueDeclaration;
        if (
            !fn ||
            (!ts.isFunctionDeclaration(fn) && !ts.isFunctionExpression(fn) && !ts.isArrowFunction(fn)) ||
            !fn.body
        ) {
            return undefined;
        }

        return this.findReturnedClass(fn.body);
    }

    protected findReturnedClass(body: ts.ConciseBody): ts.ClassDeclaration | ts.ClassExpression | undefined {
        if (ts.isClassExpression(body) || ts.isClassDeclaration(body)) {
            return body;
        }

        if (!ts.isBlock(body)) {
            return undefined;
        }

        let result: ts.ClassDeclaration | ts.ClassExpression | undefined;

        const visit = (child: ts.Node): void => {
            if (result) {
                return;
            }

            if (ts.isReturnStatement(child) && child.expression) {
                result = this.resolveReturnedClassNode(child.expression);
            }

            ts.forEachChild(child, visit);
        };

        visit(body);
        return result;
    }

    protected resolveReturnedClassNode(
        expression: ts.Expression,
    ): ts.ClassDeclaration | ts.ClassExpression | undefined {
        if (ts.isClassExpression(expression)) {
            return expression;
        }

        if (ts.isIdentifier(expression)) {
            const symbol = this.typeChecker.getSymbolAtLocation(expression);
            const decl = symbol?.valueDeclaration;
            if (decl && (ts.isClassDeclaration(decl) || ts.isClassExpression(decl))) {
                return decl;
            }
        }

        return undefined;
    }

    protected createSubContext(node: ts.CallExpression, parentContext: Context): Context {
        const subContext = new Context(node);

        for (const arg of node.arguments) {
            const type = this.childNodeParser.createType(arg, parentContext);
            subContext.pushArgument(type);
        }
        return subContext;
    }
}
