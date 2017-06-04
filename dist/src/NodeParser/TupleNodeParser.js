"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var TupleType_1 = require("../Type/TupleType");
var TupleNodeParser = (function () {
    function TupleNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    TupleNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TupleType;
    };
    TupleNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        return new TupleType_1.TupleType(node.elementTypes.map(function (item) {
            return _this.childNodeParser.createType(item, context);
        }));
    };
    return TupleNodeParser;
}());
exports.TupleNodeParser = TupleNodeParser;
//# sourceMappingURL=TupleNodeParser.js.map