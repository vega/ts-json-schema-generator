"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var NullType_1 = require("../Type/NullType");
var NullLiteralNodeParser = (function () {
    function NullLiteralNodeParser() {
    }
    NullLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.NullKeyword;
    };
    NullLiteralNodeParser.prototype.createType = function (node, context) {
        return new NullType_1.NullType();
    };
    return NullLiteralNodeParser;
}());
exports.NullLiteralNodeParser = NullLiteralNodeParser;
//# sourceMappingURL=NullLiteralNodeParser.js.map