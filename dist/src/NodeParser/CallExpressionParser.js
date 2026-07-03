"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionParser = void 0;
const tslib_1 = require("tslib");
const TupleType_js_1 = require("../Type/TupleType.js");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NodeParser_js_1 = require("../NodeParser.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const SymbolType_js_1 = require("../Type/SymbolType.js");
const Errors_js_1 = require("../Error/Errors.js");
class CallExpressionParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.CallExpression;
    }
    createType(node, context) {
        const subContext = this.createSubContext(node, context);
        const factoryReturnClass = this.getFactoryReturnClass(node);
        if (factoryReturnClass) {
            return this.childNodeParser.createType(factoryReturnClass, subContext);
        }
        const type = this.typeChecker.getTypeAtLocation(node);
        // FIXME: remove special case
        if (Array.isArray(type?.typeArguments?.[0]?.types)) {
            return new TupleType_js_1.TupleType([
                new UnionType_js_1.UnionType(type.typeArguments[0].types.map((t) => new LiteralType_js_1.LiteralType(t.value))),
            ]);
        }
        // A call expression like Symbol("entity") that resulted in a `unique symbol`
        if (type.flags === typescript_1.default.TypeFlags.UniqueESSymbol) {
            return new SymbolType_js_1.SymbolType();
        }
        const symbol = type.symbol || type.aliasSymbol;
        // For funtions like <T>(type: T) => T, there won't be any reference to the original
        // type. Using type checker to infer the actual return type without mapping the whole
        // function and back referencing its generic type based on parameter index is a better
        // approach.
        const decl = this.typeChecker.typeToTypeNode(type, node, typescript_1.default.NodeBuilderFlags.IgnoreErrors) ||
            symbol?.valueDeclaration ||
            symbol?.declarations?.[0];
        if (!decl) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        return this.childNodeParser.createType(decl, subContext);
    }
    getFactoryReturnClass(node) {
        const callee = node.expression;
        if (!typescript_1.default.isIdentifier(callee)) {
            return undefined;
        }
        const symbol = this.typeChecker.getSymbolAtLocation(callee);
        const fn = symbol?.valueDeclaration;
        if (!fn ||
            (!typescript_1.default.isFunctionDeclaration(fn) && !typescript_1.default.isFunctionExpression(fn) && !typescript_1.default.isArrowFunction(fn)) ||
            !fn.body) {
            return undefined;
        }
        return this.findReturnedClass(fn.body);
    }
    findReturnedClass(body) {
        if (typescript_1.default.isClassExpression(body) || typescript_1.default.isClassDeclaration(body)) {
            return body;
        }
        if (!typescript_1.default.isBlock(body)) {
            return undefined;
        }
        let result;
        const visit = (child) => {
            if (result) {
                return;
            }
            if (typescript_1.default.isReturnStatement(child) && child.expression) {
                result = this.resolveReturnedClassNode(child.expression);
            }
            typescript_1.default.forEachChild(child, visit);
        };
        visit(body);
        return result;
    }
    resolveReturnedClassNode(expression) {
        if (typescript_1.default.isClassExpression(expression)) {
            return expression;
        }
        if (typescript_1.default.isIdentifier(expression)) {
            const symbol = this.typeChecker.getSymbolAtLocation(expression);
            const decl = symbol?.valueDeclaration;
            if (decl && (typescript_1.default.isClassDeclaration(decl) || typescript_1.default.isClassExpression(decl))) {
                return decl;
            }
        }
        return undefined;
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_js_1.Context(node);
        for (const arg of node.arguments) {
            const type = this.childNodeParser.createType(arg, parentContext);
            subContext.pushArgument(type);
        }
        return subContext;
    }
}
exports.CallExpressionParser = CallExpressionParser;
//# sourceMappingURL=CallExpressionParser.js.map