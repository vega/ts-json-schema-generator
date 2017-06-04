"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var StringType_1 = require("../Type/StringType");
var StringTypeNodeParser = (function () {
    function StringTypeNodeParser() {
    }
    StringTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.StringKeyword;
    };
    StringTypeNodeParser.prototype.createType = function (node, context) {
        return new StringType_1.StringType();
    };
    return StringTypeNodeParser;
}());
exports.StringTypeNodeParser = StringTypeNodeParser;
//# sourceMappingURL=StringTypeNodeParser.js.map