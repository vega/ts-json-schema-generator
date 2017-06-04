"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var NodeParser_1 = require("../NodeParser");
var ArrayType_1 = require("../Type/ArrayType");
var invlidTypes = (_a = {},
    _a[ts.SyntaxKind.ModuleDeclaration] = true,
    _a[ts.SyntaxKind.VariableDeclaration] = true,
    _a);
var TypeReferenceNodeParser = (function () {
    function TypeReferenceNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    TypeReferenceNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeReference;
    };
    TypeReferenceNodeParser.prototype.createType = function (node, context) {
        var typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName);
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            var aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations.filter(function (n) { return !invlidTypes[n.kind]; })[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            return new ArrayType_1.ArrayType(this.createSubContext(node, context).getArguments()[0]);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations.filter(function (n) { return !invlidTypes[n.kind]; })[0], this.createSubContext(node, context));
        }
    };
    TypeReferenceNodeParser.prototype.createSubContext = function (node, parentContext) {
        var _this = this;
        var subContext = new NodeParser_1.Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach(function (typeArg) {
                subContext.pushArgument(_this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    };
    return TypeReferenceNodeParser;
}());
exports.TypeReferenceNodeParser = TypeReferenceNodeParser;
var _a;
//# sourceMappingURL=TypeReferenceNodeParser.js.map