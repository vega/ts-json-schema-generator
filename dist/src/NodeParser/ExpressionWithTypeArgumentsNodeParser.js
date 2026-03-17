"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionWithTypeArgumentsNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
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
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations[0], this.createSubContext(node, context));
        }
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