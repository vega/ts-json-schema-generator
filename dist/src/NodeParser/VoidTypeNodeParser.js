"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var VoidType_1 = require("../Type/VoidType");
var VoidTypeNodeParser = (function () {
    function VoidTypeNodeParser() {
    }
    VoidTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.VoidKeyword;
    };
    VoidTypeNodeParser.prototype.createType = function (node, context) {
        return new VoidType_1.VoidType();
    };
    return VoidTypeNodeParser;
}());
exports.VoidTypeNodeParser = VoidTypeNodeParser;
//# sourceMappingURL=VoidTypeNodeParser.js.map