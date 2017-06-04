"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var TypeofNodeParser = (function () {
    function TypeofNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    TypeofNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeQuery;
    };
    TypeofNodeParser.prototype.createType = function (node, context) {
        var symbol = this.typeChecker.getSymbolAtLocation(node.exprName);
        return this.childNodeParser.createType(symbol.valueDeclaration.type, context);
    };
    return TypeofNodeParser;
}());
exports.TypeofNodeParser = TypeofNodeParser;
//# sourceMappingURL=TypeofNodeParser.js.map