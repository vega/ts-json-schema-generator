"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var IntersectionType_1 = require("../Type/IntersectionType");
var IntersectionNodeParser = (function () {
    function IntersectionNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    IntersectionNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.IntersectionType;
    };
    IntersectionNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        return new IntersectionType_1.IntersectionType(node.types.map(function (subnode) {
            return _this.childNodeParser.createType(subnode, context);
        }));
    };
    return IntersectionNodeParser;
}());
exports.IntersectionNodeParser = IntersectionNodeParser;
//# sourceMappingURL=IntersectionNodeParser.js.map