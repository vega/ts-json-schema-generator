"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NullType_1 = require("../Type/NullType");
var NullTypeFormatter = (function () {
    function NullTypeFormatter() {
    }
    NullTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof NullType_1.NullType;
    };
    NullTypeFormatter.prototype.getDefinition = function (type) {
        return { type: "null" };
    };
    NullTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return NullTypeFormatter;
}());
exports.NullTypeFormatter = NullTypeFormatter;
//# sourceMappingURL=NullTypeFormatter.js.map