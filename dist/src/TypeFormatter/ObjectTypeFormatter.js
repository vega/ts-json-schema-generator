"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AnyType_1 = require("../Type/AnyType");
var BaseType_1 = require("../Type/BaseType");
var ObjectType_1 = require("../Type/ObjectType");
var allOfDefinition_1 = require("../Utils/allOfDefinition");
var ObjectTypeFormatter = (function () {
    function ObjectTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    ObjectTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof ObjectType_1.ObjectType;
    };
    ObjectTypeFormatter.prototype.getDefinition = function (type) {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }
        if (Object.keys(type.getProperties()).length === 0 &&
            type.getAdditionalProperties() === false &&
            type.getBaseTypes().length === 1) {
            return this.childTypeFormatter.getDefinition(type.getBaseTypes()[0]);
        }
        return type.getBaseTypes().reduce(allOfDefinition_1.getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    };
    ObjectTypeFormatter.prototype.getChildren = function (type) {
        var _this = this;
        var properties = type.getProperties();
        var additionalProperties = type.getAdditionalProperties();
        return type.getBaseTypes().reduce(function (result, baseType) { return result.concat(_this.childTypeFormatter.getChildren(baseType)); }, []).concat(additionalProperties instanceof BaseType_1.BaseType ?
            this.childTypeFormatter.getChildren(additionalProperties) :
            [], properties.reduce(function (result, property) { return result.concat(_this.childTypeFormatter.getChildren(property.getType())); }, []));
    };
    ObjectTypeFormatter.prototype.getObjectDefinition = function (type) {
        var _this = this;
        var objectProperties = type.getProperties();
        var additionalProperties = type.getAdditionalProperties();
        var required = objectProperties
            .filter(function (property) { return property.isRequired(); })
            .map(function (property) { return property.getName(); });
        var properties = objectProperties.reduce(function (result, property) {
            result[property.getName()] = _this.childTypeFormatter.getDefinition(property.getType());
            return result;
        }, {});
        return __assign({ type: "object" }, (Object.keys(properties).length > 0 ? { properties: properties } : {}), (required.length > 0 ? { required: required } : {}), (additionalProperties === true || additionalProperties instanceof AnyType_1.AnyType ? {} :
            { additionalProperties: additionalProperties instanceof BaseType_1.BaseType ?
                    this.childTypeFormatter.getDefinition(additionalProperties) :
                    additionalProperties }));
    };
    return ObjectTypeFormatter;
}());
exports.ObjectTypeFormatter = ObjectTypeFormatter;
//# sourceMappingURL=ObjectTypeFormatter.js.map