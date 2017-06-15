"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var EnumType_1 = require("../Type/EnumType");
var IndexedAccessTypeNodeParser = (function () {
    function IndexedAccessTypeNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    IndexedAccessTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    };
    IndexedAccessTypeNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        var symbol = this.typeChecker.getSymbolAtLocation(node.objectType.exprName);
        return new EnumType_1.EnumType("indexed-type-" + node.getFullStart(), symbol.valueDeclaration.type.elementTypes.map(function (memberType) {
            return _this.childNodeParser.createType(memberType, context);
        }));
    };
    return IndexedAccessTypeNodeParser;
}());
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map