"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NodeParser_1 = require("../NodeParser");
class ExpressionWithTypeArgumentsNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    createType(node, context) {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations[0], this.createSubContext(node, context));
        }
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg) => {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    }
}
exports.ExpressionWithTypeArgumentsNodeParser = ExpressionWithTypeArgumentsNodeParser;
//# sourceMappingURL=ExpressionWithTypeArgumentsNodeParser.js.map