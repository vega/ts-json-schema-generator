"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var NumberType_1 = require("../Type/NumberType");
var NumberTypeNodeParser = (function () {
    function NumberTypeNodeParser() {
    }
    NumberTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.NumberKeyword;
    };
    NumberTypeNodeParser.prototype.createType = function (node, context) {
        return new NumberType_1.NumberType();
    };
    return NumberTypeNodeParser;
}());
exports.NumberTypeNodeParser = NumberTypeNodeParser;
//# sourceMappingURL=NumberTypeNodeParser.js.map