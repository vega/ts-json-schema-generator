"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ObjectType_1 = require("../Type/ObjectType");
var TypeLiteralNodeParser = (function () {
    function TypeLiteralNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    TypeLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    };
    TypeLiteralNodeParser.prototype.createType = function (node, context) {
        return new ObjectType_1.ObjectType("structure-" + node.getFullStart(), [], this.getProperties(node, context), this.getAdditionalProperties(node, context));
    };
    TypeLiteralNodeParser.prototype.getProperties = function (node, context) {
        var _this = this;
        return node.members
            .filter(function (property) { return property.kind === ts.SyntaxKind.PropertySignature; })
            .reduce(function (result, propertyNode) {
            var propertySymbol = propertyNode.symbol;
            var objectProperty = new ObjectType_1.ObjectProperty(propertySymbol.getName(), _this.childNodeParser.createType(propertyNode.type, context), !propertyNode.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    };
    TypeLiteralNodeParser.prototype.getAdditionalProperties = function (node, context) {
        var properties = node.members
            .filter(function (property) { return property.kind === ts.SyntaxKind.IndexSignature; });
        if (!properties.length) {
            return false;
        }
        var signature = properties[0];
        return this.childNodeParser.createType(signature.type, context);
    };
    return TypeLiteralNodeParser;
}());
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map