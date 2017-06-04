"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringType_1 = require("../Type/StringType");
var StringTypeFormatter = (function () {
    function StringTypeFormatter() {
    }
    StringTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof StringType_1.StringType;
    };
    StringTypeFormatter.prototype.getDefinition = function (type) {
        return { type: "string" };
    };
    StringTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return StringTypeFormatter;
}());
exports.StringTypeFormatter = StringTypeFormatter;
//# sourceMappingURL=StringTypeFormatter.js.map