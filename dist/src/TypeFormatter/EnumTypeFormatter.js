"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumType_1 = require("../Type/EnumType");
var uniqueArray_1 = require("../Utils/uniqueArray");
var EnumTypeFormatter = (function () {
    function EnumTypeFormatter() {
    }
    EnumTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof EnumType_1.EnumType;
    };
    EnumTypeFormatter.prototype.getDefinition = function (type) {
        var _this = this;
        var values = uniqueArray_1.uniqueArray(type.getValues());
        var types = uniqueArray_1.uniqueArray(values.map(function (value) { return _this.getValueType(value); }));
        if (types.length === 1) {
            return {
                type: types[0],
                enum: values,
            };
        }
        else {
            return {
                type: types,
                enum: values,
            };
        }
    };
    EnumTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    EnumTypeFormatter.prototype.getValueType = function (value) {
        return value === null ? "null" : typeof value;
    };
    return EnumTypeFormatter;
}());
exports.EnumTypeFormatter = EnumTypeFormatter;
//# sourceMappingURL=EnumTypeFormatter.js.map