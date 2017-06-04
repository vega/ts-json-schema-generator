"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ArrayType_1 = require("../Type/ArrayType");
var ArrayNodeParser = (function () {
    function ArrayNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    ArrayNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.ArrayType;
    };
    ArrayNodeParser.prototype.createType = function (node, context) {
        return new ArrayType_1.ArrayType(this.childNodeParser.createType(node.elementType, context));
    };
    return ArrayNodeParser;
}());
exports.ArrayNodeParser = ArrayNodeParser;
//# sourceMappingURL=ArrayNodeParser.js.map