"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VoidType_1 = require("../Type/VoidType");
var VoidTypeFormatter = (function () {
    function VoidTypeFormatter() {
    }
    VoidTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof VoidType_1.VoidType;
    };
    VoidTypeFormatter.prototype.getDefinition = function (type) {
        return { type: "null" };
    };
    VoidTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return VoidTypeFormatter;
}());
exports.VoidTypeFormatter = VoidTypeFormatter;
//# sourceMappingURL=VoidTypeFormatter.js.map