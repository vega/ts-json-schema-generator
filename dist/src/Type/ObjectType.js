"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseType_1 = require("./BaseType");
var ObjectProperty = (function () {
    function ObjectProperty(name, type, required) {
        this.name = name;
        this.type = type;
        this.required = required;
    }
    ObjectProperty.prototype.getName = function () {
        return this.name;
    };
    ObjectProperty.prototype.getType = function () {
        return this.type;
    };
    ObjectProperty.prototype.isRequired = function () {
        return this.required;
    };
    return ObjectProperty;
}());
exports.ObjectProperty = ObjectProperty;
var ObjectType = (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType(id, baseTypes, properties, additionalProperties) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.baseTypes = baseTypes;
        _this.properties = properties;
        _this.additionalProperties = additionalProperties;
        return _this;
    }
    ObjectType.prototype.getId = function () {
        return this.id;
    };
    ObjectType.prototype.getBaseTypes = function () {
        return this.baseTypes;
    };
    ObjectType.prototype.getProperties = function () {
        return this.properties;
    };
    ObjectType.prototype.getAdditionalProperties = function () {
        return this.additionalProperties;
    };
    return ObjectType;
}(BaseType_1.BaseType));
exports.ObjectType = ObjectType;
//# sourceMappingURL=ObjectType.js.map