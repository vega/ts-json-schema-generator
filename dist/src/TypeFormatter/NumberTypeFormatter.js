"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberType_1 = require("../Type/NumberType");
var NumberTypeFormatter = (function () {
    function NumberTypeFormatter() {
    }
    NumberTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof NumberType_1.NumberType;
    };
    NumberTypeFormatter.prototype.getDefinition = function (type) {
        return { type: "number" };
    };
    NumberTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return NumberTypeFormatter;
}());
exports.NumberTypeFormatter = NumberTypeFormatter;
//# sourceMappingURL=NumberTypeFormatter.js.map