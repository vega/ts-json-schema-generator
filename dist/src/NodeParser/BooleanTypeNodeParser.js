"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var BooleanType_1 = require("../Type/BooleanType");
var BooleanTypeNodeParser = (function () {
    function BooleanTypeNodeParser() {
    }
    BooleanTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    };
    BooleanTypeNodeParser.prototype.createType = function (node, context) {
        return new BooleanType_1.BooleanType();
    };
    return BooleanTypeNodeParser;
}());
exports.BooleanTypeNodeParser = BooleanTypeNodeParser;
//# sourceMappingURL=BooleanTypeNodeParser.js.map