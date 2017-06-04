"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnyType_1 = require("../Type/AnyType");
var AnyTypeFormatter = (function () {
    function AnyTypeFormatter() {
    }
    AnyTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof AnyType_1.AnyType;
    };
    AnyTypeFormatter.prototype.getDefinition = function (type) {
        return {};
    };
    AnyTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return AnyTypeFormatter;
}());
exports.AnyTypeFormatter = AnyTypeFormatter;
//# sourceMappingURL=AnyTypeFormatter.js.map