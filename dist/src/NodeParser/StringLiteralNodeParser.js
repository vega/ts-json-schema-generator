"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var LiteralType_1 = require("../Type/LiteralType");
var StringLiteralNodeParser = (function () {
    function StringLiteralNodeParser() {
    }
    StringLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.StringLiteral;
    };
    StringLiteralNodeParser.prototype.createType = function (node, context) {
        return new LiteralType_1.LiteralType(node.text);
    };
    return StringLiteralNodeParser;
}());
exports.StringLiteralNodeParser = StringLiteralNodeParser;
//# sourceMappingURL=StringLiteralNodeParser.js.map