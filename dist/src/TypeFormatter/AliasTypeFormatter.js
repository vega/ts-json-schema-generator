"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AliasType_1 = require("../Type/AliasType");
var AliasTypeFormatter = (function () {
    function AliasTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    AliasTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof AliasType_1.AliasType;
    };
    AliasTypeFormatter.prototype.getDefinition = function (type) {
        return this.childTypeFormatter.getDefinition(type.getType());
    };
    AliasTypeFormatter.prototype.getChildren = function (type) {
        return this.childTypeFormatter.getChildren(type.getType());
    };
    return AliasTypeFormatter;
}());
exports.AliasTypeFormatter = AliasTypeFormatter;
//# sourceMappingURL=AliasTypeFormatter.js.map