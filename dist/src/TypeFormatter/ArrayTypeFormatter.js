"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayType_1 = require("../Type/ArrayType");
var ArrayTypeFormatter = (function () {
    function ArrayTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    ArrayTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof ArrayType_1.ArrayType;
    };
    ArrayTypeFormatter.prototype.getDefinition = function (type) {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type.getItem()),
        };
    };
    ArrayTypeFormatter.prototype.getChildren = function (type) {
        return this.childTypeFormatter.getChildren(type.getItem());
    };
    return ArrayTypeFormatter;
}());
exports.ArrayTypeFormatter = ArrayTypeFormatter;
//# sourceMappingURL=ArrayTypeFormatter.js.map