"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ParenthesizedNodeParser = (function () {
    function ParenthesizedNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    ParenthesizedNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.ParenthesizedType;
    };
    ParenthesizedNodeParser.prototype.createType = function (node, context) {
        return this.childNodeParser.createType(node.type, context);
    };
    return ParenthesizedNodeParser;
}());
exports.ParenthesizedNodeParser = ParenthesizedNodeParser;
//# sourceMappingURL=ParenthesizedNodeParser.js.map