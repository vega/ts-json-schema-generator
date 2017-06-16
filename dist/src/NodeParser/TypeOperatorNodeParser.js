"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var EnumType_1 = require("../Type/EnumType");
var TypeOperatorNodeParser = (function () {
    function TypeOperatorNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    TypeOperatorNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeOperator;
    };
    TypeOperatorNodeParser.prototype.createType = function (node, context) {
        var type = this.typeChecker.getTypeFromTypeNode(node);
        return new EnumType_1.EnumType("keyof-type-" + node.getFullStart(), type.types.map(function (t) { return t.text; }));
    };
    return TypeOperatorNodeParser;
}());
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map