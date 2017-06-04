"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var LiteralNodeParser = (function () {
    function LiteralNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    LiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.LiteralType;
    };
    LiteralNodeParser.prototype.createType = function (node, context) {
        return this.childNodeParser.createType(node.literal, context);
    };
    return LiteralNodeParser;
}());
exports.LiteralNodeParser = LiteralNodeParser;
//# sourceMappingURL=LiteralNodeParser.js.map