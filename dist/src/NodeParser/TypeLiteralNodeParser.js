"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ObjectType_1 = require("../Type/ObjectType");
var isHidden_1 = require("../Utils/isHidden");
var TypeLiteralNodeParser = (function () {
    function TypeLiteralNodeParser(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    TypeLiteralNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    };
    TypeLiteralNodeParser.prototype.createType = function (node, context) {
        return new ObjectType_1.ObjectType(this.getTypeId(node, context), [], this.getProperties(node, context), this.getAdditionalProperties(node, context));
    };
    TypeLiteralNodeParser.prototype.getProperties = function (node, context) {
        var _this = this;
        return node.members
            .filter(function (property) { return property.kind === ts.SyntaxKind.PropertySignature; })
            .reduce(function (result, propertyNode) {
            var propertySymbol = propertyNode.symbol;
            if (isHidden_1.isHidden(propertySymbol)) {
                return result;
            }
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
    TypeLiteralNodeParser.prototype.getTypeId = function (node, context) {
        var fullName = "structure-" + node.getFullStart();
        var argumentIds = context.getArguments().map(function (arg) { return arg.getId(); });
        return argumentIds.length ? fullName + "<" + argumentIds.join(",") + ">" : fullName;
    };
    return TypeLiteralNodeParser;
}());
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map