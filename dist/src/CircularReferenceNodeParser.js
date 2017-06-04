"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceType_1 = require("./Type/ReferenceType");
var CircularReferenceNodeParser = (function () {
    function CircularReferenceNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
        this.circular = {};
    }
    CircularReferenceNodeParser.prototype.supportsNode = function (node) {
        return this.childNodeParser.supportsNode(node);
    };
    CircularReferenceNodeParser.prototype.createType = function (node, context) {
        var key = this.createCacheKey(node, context);
        if (this.circular[key]) {
            return this.circular[key];
        }
        var reference = new ReferenceType_1.ReferenceType();
        this.circular[key] = reference;
        reference.setType(this.childNodeParser.createType(node, context));
        delete this.circular[key];
        return reference.getType();
    };
    CircularReferenceNodeParser.prototype.createCacheKey = function (node, context) {
        var ids = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }
        return ids.join("-") + "<" + context.getArguments().map(function (arg) { return arg.getId(); }).join(",") + ">";
    };
    return CircularReferenceNodeParser;
}());
exports.CircularReferenceNodeParser = CircularReferenceNodeParser;
//# sourceMappingURL=CircularReferenceNodeParser.js.map