"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TupleType_1 = require("../Type/TupleType");
var TupleTypeFormatter = (function () {
    function TupleTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    TupleTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof TupleType_1.TupleType;
    };
    TupleTypeFormatter.prototype.getDefinition = function (type) {
        var _this = this;
        var tupleDefinitions = type.getTypes()
            .map(function (item) { return _this.childTypeFormatter.getDefinition(item); });
        return {
            type: "array",
            items: tupleDefinitions,
            minItems: tupleDefinitions.length,
            additionalItems: { anyOf: tupleDefinitions },
        };
    };
    TupleTypeFormatter.prototype.getChildren = function (type) {
        var _this = this;
        return type.getTypes().reduce(function (result, item) { return result.concat(_this.childTypeFormatter.getChildren(item)); }, []);
    };
    return TupleTypeFormatter;
}());
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map