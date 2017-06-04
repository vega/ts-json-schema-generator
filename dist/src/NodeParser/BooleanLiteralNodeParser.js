"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var LiteralType_1 = require("../Type/LiteralType");
var BooleanLiteralNodeParser = (function () {
    function BooleanLiteralNodeParser() {
    }
    BooleanLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
    };
    BooleanLiteralNodeParser.prototype.createType = function (node, context) {
        return new LiteralType_1.LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
    };
    return BooleanLiteralNodeParser;
}());
exports.BooleanLiteralNodeParser = BooleanLiteralNodeParser;
//# sourceMappingURL=BooleanLiteralNodeParser.js.map