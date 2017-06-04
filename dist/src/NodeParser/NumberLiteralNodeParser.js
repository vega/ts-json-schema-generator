"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var LiteralType_1 = require("../Type/LiteralType");
var NumberLiteralNodeParser = (function () {
    function NumberLiteralNodeParser() {
    }
    NumberLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.NumericLiteral;
    };
    NumberLiteralNodeParser.prototype.createType = function (node, context) {
        return new LiteralType_1.LiteralType(parseFloat(node.text));
    };
    return NumberLiteralNodeParser;
}());
exports.NumberLiteralNodeParser = NumberLiteralNodeParser;
//# sourceMappingURL=NumberLiteralNodeParser.js.map