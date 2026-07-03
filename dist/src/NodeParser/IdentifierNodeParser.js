"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
/**
 * Resolves identifiers whose value is a compile-time constant or a class-like declaration.
 */
class IdentifierNodeParser {
    childNodeParser;
    checker;
    constructor(childNodeParser, checker) {
        this.childNodeParser = childNodeParser;
        this.checker = checker;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.Identifier;
    }
    createType(node, context) {
        const symbol = this.checker.getSymbolAtLocation(node);
        if (!symbol) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        if (symbol.flags & typescript_1.default.SymbolFlags.Alias) {
            return this.createTypeFromDeclaration(this.checker.getAliasedSymbol(symbol).valueDeclaration, context, node);
        }
        return this.createTypeFromDeclaration(symbol.valueDeclaration, context, node);
    }
    createTypeFromDeclaration(decl, context, node) {
        if (decl &&
            typescript_1.default.isVariableDeclaration(decl) &&
            decl.initializer &&
            typescript_1.default.getCombinedNodeFlags(decl) & typescript_1.default.NodeFlags.Const) {
            return this.childNodeParser.createType(decl.initializer, context);
        }
        if (decl &&
            (typescript_1.default.isClassDeclaration(decl) ||
                typescript_1.default.isInterfaceDeclaration(decl) ||
                typescript_1.default.isTypeAliasDeclaration(decl))) {
            return this.childNodeParser.createType(decl, context);
        }
        if (decl && typescript_1.default.isParameter(decl)) {
            const parameterType = this.getConstructorParameterArgumentType(decl, context);
            if (parameterType) {
                return parameterType;
            }
        }
        throw new Errors_js_1.UnknownNodeError(node);
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
}
exports.IdentifierNodeParser = IdentifierNodeParser;
//# sourceMappingURL=IdentifierNodeParser.js.map