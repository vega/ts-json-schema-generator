"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ObjectType_1 = require("../Type/ObjectType");
var isHidden_1 = require("../Utils/isHidden");
var InterfaceNodeParser = (function () {
    function InterfaceNodeParser(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    InterfaceNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration;
    };
    InterfaceNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach(function (typeParam) {
                var nameSymbol = _this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }
        return new ObjectType_1.ObjectType(this.getTypeId(node, context), this.getBaseTypes(node, context), this.getProperties(node, context), this.getAdditionalProperties(node, context));
    };
    InterfaceNodeParser.prototype.getBaseTypes = function (node, context) {
        var _this = this;
        if (!node.heritageClauses) {
            return [];
        }
        return node.heritageClauses.reduce(function (result, baseType) {
            return result.concat(baseType.types.map(function (expression) {
                return _this.childNodeParser.createType(expression, context);
            }));
        }, []);
    };
    InterfaceNodeParser.prototype.getProperties = function (node, context) {
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
    InterfaceNodeParser.prototype.getAdditionalProperties = function (node, context) {
        var properties = node.members
            .filter(function (property) { return property.kind === ts.SyntaxKind.IndexSignature; });
        if (!properties.length) {
            return false;
        }
        var signature = properties[0];
        return this.childNodeParser.createType(signature.type, context);
    };
    InterfaceNodeParser.prototype.getTypeId = function (node, context) {
        var fullName = "interface-" + node.getFullStart();
        var argumentIds = context.getArguments().map(function (arg) { return arg.getId(); });
        return argumentIds.length ? fullName + "<" + argumentIds.join(",") + ">" : fullName;
    };
    return InterfaceNodeParser;
}());
exports.InterfaceNodeParser = InterfaceNodeParser;
//# sourceMappingURL=InterfaceNodeParser.js.map