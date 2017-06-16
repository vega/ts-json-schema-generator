"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ObjectType_1 = require("../Type/ObjectType");
var MappedTypeNodeParser = (function () {
    function MappedTypeNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    MappedTypeNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.MappedType;
    };
    MappedTypeNodeParser.prototype.createType = function (node, context) {
        return new ObjectType_1.ObjectType("indexed-type-" + node.getFullStart(), [], this.getProperties(node, context), false);
    };
    MappedTypeNodeParser.prototype.getProperties = function (node, context) {
        var _this = this;
        var type = this.typeChecker.getTypeFromTypeNode(node.typeParameter.constraint);
        return type.types
            .reduce(function (result, t) {
            var objectProperty = new ObjectType_1.ObjectProperty(t.text, _this.childNodeParser.createType(node.type, context), !node.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    };
    return MappedTypeNodeParser;
}());
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map