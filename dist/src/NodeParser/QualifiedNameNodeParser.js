"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var AliasType_1 = require("../Type/AliasType");
var QualifiedNameNodeParser = (function () {
    function QualifiedNameNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    QualifiedNameNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.QualifiedName;
    };
    QualifiedNameNodeParser.prototype.createType = function (node, context) {
        var symbol = this.typeChecker.getSymbolAtLocation(node.right);
        context.pushParameter(symbol.name);
        return new AliasType_1.AliasType(node.left + "." + node.right, this.childNodeParser.createType(symbol.valueDeclaration, context));
    };
    return QualifiedNameNodeParser;
}());
exports.QualifiedNameNodeParser = QualifiedNameNodeParser;
//# sourceMappingURL=QualifiedNameNodeParser.js.map