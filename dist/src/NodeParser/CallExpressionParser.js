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
            symbol.valueDeclaration ||
            symbol.declarations?.[0];
        if (!decl) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        return this.childNodeParser.createType(decl, this.createSubContext(node, context));
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