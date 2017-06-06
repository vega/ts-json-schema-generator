"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ObjectType_1 = require("../Type/ObjectType");
var ObjectTypeNodeParser = (function () {
    function ObjectTypeNodeParser() {
    }
    ObjectTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    };
    ObjectTypeNodeParser.prototype.createType = function (node, context) {
        return new ObjectType_1.ObjectType("object-" + node.getFullStart(), [], [], true);
    };
    return ObjectTypeNodeParser;
}());
exports.ObjectTypeNodeParser = ObjectTypeNodeParser;
//# sourceMappingURL=ObjectTypeNodeParser.js.map