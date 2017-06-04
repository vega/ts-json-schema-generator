"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogicError_1 = require("../Error/LogicError");
var PrimitiveType_1 = require("../Type/PrimitiveType");
var UnionType_1 = require("../Type/UnionType");
var uniqueArray_1 = require("../Utils/uniqueArray");
var BooleanType_1 = require("../Type/BooleanType");
var NullType_1 = require("../Type/NullType");
var NumberType_1 = require("../Type/NumberType");
var StringType_1 = require("../Type/StringType");
var PrimitiveUnionTypeFormatter = (function () {
    function PrimitiveUnionTypeFormatter() {
    }
    PrimitiveUnionTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof UnionType_1.UnionType && this.isPrimitiveUnion(type);
    };
    PrimitiveUnionTypeFormatter.prototype.getDefinition = function (type) {
        var _this = this;
        return {
            type: uniqueArray_1.uniqueArray(type.getTypes().map(function (item) { return _this.getPrimitiveType(item); })),
        };
    };
    PrimitiveUnionTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    PrimitiveUnionTypeFormatter.prototype.isPrimitiveUnion = function (type) {
        return type.getTypes().every(function (item) { return item instanceof PrimitiveType_1.PrimitiveType; });
    };
    PrimitiveUnionTypeFormatter.prototype.getPrimitiveType = function (item) {
        if (item instanceof StringType_1.StringType) {
            return "string";
        }
        else if (item instanceof NumberType_1.NumberType) {
            return "number";
        }
        else if (item instanceof BooleanType_1.BooleanType) {
            return "boolean";
        }
        else if (item instanceof NullType_1.NullType) {
            return "null";
        }
        throw new LogicError_1.LogicError("Unexpected code branch");
    };
    return PrimitiveUnionTypeFormatter;
}());
exports.PrimitiveUnionTypeFormatter = PrimitiveUnionTypeFormatter;
//# sourceMappingURL=PrimitiveUnionTypeFormatter.js.map