"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var VariableDeclarationNodeParser = (function () {
    function VariableDeclarationNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    VariableDeclarationNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.VariableDeclaration;
    };
    VariableDeclarationNodeParser.prototype.createType = function (node, context) {
        return null;
    };
    return VariableDeclarationNodeParser;
}());
exports.VariableDeclarationNodeParser = VariableDeclarationNodeParser;
//# sourceMappingURL=VariableDeclarationNodeParser.js.map