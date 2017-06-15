"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LiteralType_1 = require("../Type/LiteralType");
var UnionType_1 = require("../Type/UnionType");
var uniqueArray_1 = require("../Utils/uniqueArray");
var LiteralUnionTypeFormatter = (function () {
    function LiteralUnionTypeFormatter() {
    }
    LiteralUnionTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof UnionType_1.UnionType && this.isLiteralUnion(type);
    };
    LiteralUnionTypeFormatter.prototype.getDefinition = function (type) {
        var _this = this;
        var values = uniqueArray_1.uniqueArray(type.getTypes().map(function (item) { return item.getValue(); }));
        var types = uniqueArray_1.uniqueArray(type.getTypes().map(function (item) { return _this.getLiteralType(item); }));
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
    LiteralUnionTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    LiteralUnionTypeFormatter.prototype.isLiteralUnion = function (type) {
        return type.getTypes().every(function (item) { return item instanceof LiteralType_1.LiteralType; });
    };
    LiteralUnionTypeFormatter.prototype.getLiteralType = function (value) {
        return value.getValue() === null ? "null" : typeof value.getValue();
    };
    return LiteralUnionTypeFormatter;
}());
exports.LiteralUnionTypeFormatter = LiteralUnionTypeFormatter;
//# sourceMappingURL=LiteralUnionTypeFormatter.js.map