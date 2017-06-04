"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var UnionType_1 = require("../Type/UnionType");
var UnionNodeParser = (function () {
    function UnionNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    UnionNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.UnionType;
    };
    UnionNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        return new UnionType_1.UnionType(node.types.map(function (subnode) {
            return _this.childNodeParser.createType(subnode, context);
        }));
    };
    return UnionNodeParser;
}());
exports.UnionNodeParser = UnionNodeParser;
//# sourceMappingURL=UnionNodeParser.js.map