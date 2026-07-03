"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionWithTypeArgumentsNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const NodeParser_js_1 = require("../NodeParser.js");
class ExpressionWithTypeArgumentsNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ExpressionWithTypeArguments;
    }
    createType(node, context) {
        const subContext = this.createSubContext(node, context);
        const expression = node.expression;
        if (typescript_1.default.isCallExpression(expression)) {
            return this.childNodeParser.createType(expression, context);
        }
        const typeSymbol = this.typeChecker.getSymbolAtLocation(expression);
        if (!typeSymbol) {
            throw new Errors_js_1.UnknownNodeError(expression);
        }
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.createTypeFromSymbol(aliasedSymbol, expression, subContext, context);
        }
        return this.createTypeFromSymbol(typeSymbol, expression, subContext, context);
    }
    createTypeFromSymbol(typeSymbol, expression, subContext, context) {
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
            const argumentType = context.getArgument(typeSymbol.name);
            if (argumentType) {
                return argumentType;
            }
        }
        const declaration = this.getHeritageDeclaration(typeSymbol, expression);
        const parameterArgumentType = typescript_1.default.isParameter(declaration)
            ? this.getConstructorParameterArgumentType(declaration, context)
            : undefined;
        if (parameterArgumentType) {
            return parameterArgumentType;
        }
        return this.childNodeParser.createType(declaration, this.getParseContext(declaration, subContext, context));
    }
    getParseContext(declaration, subContext, context) {
        if (typescript_1.default.isCallExpression(declaration) || typescript_1.default.isClassExpression(declaration)) {
            return context;
        }
        return subContext;
    }
    getConstructorParameterArgumentType(parameter, context) {
        const args = context.getArguments();
        if (!args.length) {
            return undefined;
        }
        const parent = parameter.parent;
        if (!typescript_1.default.isFunctionLike(parent)) {
            return undefined;
        }
        const index = parent.parameters.indexOf(parameter);
        if (index < 0 || index >= args.length) {
            return undefined;
        }
        return args[index];
    }
    /**
     * Resolves heritage targets to a node the parser chain can handle.
     * Factory mixins assign classes to const variables or return them from call expressions.
     */
    getHeritageDeclaration(symbol, expression) {
        const declarations = symbol.declarations ?? (symbol.valueDeclaration ? [symbol.valueDeclaration] : []);
        const classLike = declarations.find((declaration) => typescript_1.default.isClassDeclaration(declaration) ||
            typescript_1.default.isInterfaceDeclaration(declaration) ||
            typescript_1.default.isTypeAliasDeclaration(declaration));
        if (classLike) {
            return classLike;
        }
        const variableDecl = declarations.find(typescript_1.default.isVariableDeclaration);
        if (variableDecl?.initializer) {
            return variableDecl.initializer;
        }
        const declaration = declarations[0];
        if (!declaration) {
            throw new Errors_js_1.UnknownNodeError(expression);
        }
        return declaration;
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_js_1.Context(node);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}
exports.ExpressionWithTypeArgumentsNodeParser = ExpressionWithTypeArgumentsNodeParser;
//# sourceMappingURL=ExpressionWithTypeArgumentsNodeParser.js.map