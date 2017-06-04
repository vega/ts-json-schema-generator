"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnknownNodeError_1 = require("./Error/UnknownNodeError");
var ChainNodeParser = (function () {
    function ChainNodeParser(typeChecker, nodeParsers) {
        this.typeChecker = typeChecker;
        this.nodeParsers = nodeParsers;
    }
    ChainNodeParser.prototype.addNodeParser = function (nodeParser) {
        this.nodeParsers.push(nodeParser);
        return this;
    };
    ChainNodeParser.prototype.supportsNode = function (node) {
        return this.nodeParsers.some(function (nodeParser) { return nodeParser.supportsNode(node); });
    };
    ChainNodeParser.prototype.createType = function (node, context) {
        return this.getNodeParser(node, context).createType(node, context);
    };
    ChainNodeParser.prototype.getNodeParser = function (node, context) {
        for (var _i = 0, _a = this.nodeParsers; _i < _a.length; _i++) {
            var nodeParser = _a[_i];
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }
        throw new UnknownNodeError_1.UnknownNodeError(node, context.getReference());
    };
    return ChainNodeParser;
}());
exports.ChainNodeParser = ChainNodeParser;
//# sourceMappingURL=ChainNodeParser.js.map