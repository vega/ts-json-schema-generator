"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnionType_1 = require("../Type/UnionType");
var UnionTypeFormatter = (function () {
    function UnionTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    UnionTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof UnionType_1.UnionType;
    };
    UnionTypeFormatter.prototype.getDefinition = function (type) {
        var _this = this;
        return {
            anyOf: type.getTypes().map(function (item) { return _this.childTypeFormatter.getDefinition(item); }),
        };
    };
    UnionTypeFormatter.prototype.getChildren = function (type) {
        var _this = this;
        return type.getTypes().reduce(function (result, item) { return result.concat(_this.childTypeFormatter.getChildren(item)); }, []);
    };
    return UnionTypeFormatter;
}());
exports.UnionTypeFormatter = UnionTypeFormatter;
//# sourceMappingURL=UnionTypeFormatter.js.map