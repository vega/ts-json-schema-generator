"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LiteralType_1 = require("../Type/LiteralType");
var LiteralTypeFormatter = (function () {
    function LiteralTypeFormatter() {
    }
    LiteralTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof LiteralType_1.LiteralType;
    };
    LiteralTypeFormatter.prototype.getDefinition = function (type) {
        return {
            type: typeof type.getValue(),
            enum: [type.getValue()],
        };
    };
    LiteralTypeFormatter.prototype.getChildren = function (type) {
        return [];
    };
    return LiteralTypeFormatter;
}());
exports.LiteralTypeFormatter = LiteralTypeFormatter;
//# sourceMappingURL=LiteralTypeFormatter.js.map