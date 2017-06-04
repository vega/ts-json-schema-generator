"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var AnyType_1 = require("../Type/AnyType");
var AnyTypeNodeParser = (function () {
    function AnyTypeNodeParser() {
    }
    AnyTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.AnyKeyword;
    };
    AnyTypeNodeParser.prototype.createType = function (node, context) {
        return new AnyType_1.AnyType();
    };
    return AnyTypeNodeParser;
}());
exports.AnyTypeNodeParser = AnyTypeNodeParser;
//# sourceMappingURL=AnyTypeNodeParser.js.map