"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BooleanType_1 = require("../Type/BooleanType");
var BooleanTypeFormatter = (function () {
    function BooleanTypeFormatter() {
    }
    BooleanTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof BooleanType_1.BooleanType;
    };
    BooleanTypeFormatter.prototype.getDefinition = function (type) {
        return { type: "boolean" };
    };
    BooleanTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return BooleanTypeFormatter;
}());
exports.BooleanTypeFormatter = BooleanTypeFormatter;
//# sourceMappingURL=BooleanTypeFormatter.js.map