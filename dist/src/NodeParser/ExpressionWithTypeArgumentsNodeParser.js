"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var NodeParser_1 = require("../NodeParser");
var ExpressionWithTypeArgumentsNodeParser = (function () {
    function ExpressionWithTypeArgumentsNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    ExpressionWithTypeArgumentsNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    };
    ExpressionWithTypeArgumentsNodeParser.prototype.createType = function (node, context) {
        var typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            var aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations[0], this.createSubContext(node, context));
        }
    };
    ExpressionWithTypeArgumentsNodeParser.prototype.createSubContext = function (node, parentContext) {
        var _this = this;
        var subContext = new NodeParser_1.Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach(function (typeArg) {
                subContext.pushArgument(_this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    };
    return ExpressionWithTypeArgumentsNodeParser;
}());
exports.ExpressionWithTypeArgumentsNodeParser = ExpressionWithTypeArgumentsNodeParser;
//# sourceMappingURL=ExpressionWithTypeArgumentsNodeParser.js.map