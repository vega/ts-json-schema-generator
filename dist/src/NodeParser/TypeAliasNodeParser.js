"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var AliasType_1 = require("../Type/AliasType");
var TypeAliasNodeParser = (function () {
    function TypeAliasNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    TypeAliasNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    };
    TypeAliasNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach(function (typeParam) {
                var nameSymbol = _this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }
        return new AliasType_1.AliasType(this.getTypeId(node, context), this.childNodeParser.createType(node.type, context));
    };
    TypeAliasNodeParser.prototype.getTypeId = function (node, context) {
        var fullName = "alias-" + node.getFullStart();
        var argumentIds = context.getArguments().map(function (arg) { return arg.getId(); });
        return argumentIds.length ? fullName + "<" + argumentIds.join(",") + ">" : fullName;
    };
    return TypeAliasNodeParser;
}());
exports.TypeAliasNodeParser = TypeAliasNodeParser;
//# sourceMappingURL=TypeAliasNodeParser.js.map