"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnknownTypeError_1 = require("./Error/UnknownTypeError");
var ChainTypeFormatter = (function () {
    function ChainTypeFormatter(typeFormatters) {
        this.typeFormatters = typeFormatters;
    }
    ChainTypeFormatter.prototype.addTypeFormatter = function (typeFormatter) {
        this.typeFormatters.push(typeFormatter);
        return this;
    };
    ChainTypeFormatter.prototype.supportsType = function (type) {
        return this.typeFormatters.some(function (typeFormatter) { return typeFormatter.supportsType(type); });
    };
    ChainTypeFormatter.prototype.getDefinition = function (type) {
        return this.getTypeFormatter(type).getDefinition(type);
    };
    ChainTypeFormatter.prototype.getChildren = function (type) {
        return this.getTypeFormatter(type).getChildren(type);
    };
    ChainTypeFormatter.prototype.getTypeFormatter = function (type) {
        for (var _i = 0, _a = this.typeFormatters; _i < _a.length; _i++) {
            var typeFormatter = _a[_i];
            if (typeFormatter.supportsType(type)) {
                return typeFormatter;
            }
        }
        throw new UnknownTypeError_1.UnknownTypeError(type);
    };
    return ChainTypeFormatter;
}());
exports.ChainTypeFormatter = ChainTypeFormatter;
//# sourceMappingURL=ChainTypeFormatter.js.map