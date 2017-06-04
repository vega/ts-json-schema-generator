"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IntersectionType_1 = require("../Type/IntersectionType");
var allOfDefinition_1 = require("../Utils/allOfDefinition");
var IntersectionTypeFormatter = (function () {
    function IntersectionTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    IntersectionTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof IntersectionType_1.IntersectionType;
    };
    IntersectionTypeFormatter.prototype.getDefinition = function (type) {
        return type.getTypes().reduce(allOfDefinition_1.getAllOfDefinitionReducer(this.childTypeFormatter), { type: "object", additionalProperties: false });
    };
    IntersectionTypeFormatter.prototype.getChildren = function (type) {
        var _this = this;
        return type.getTypes().reduce(function (result, item) { return result.concat(_this.childTypeFormatter.getChildren(item)); }, []);
    };
    return IntersectionTypeFormatter;
}());
exports.IntersectionTypeFormatter = IntersectionTypeFormatter;
//# sourceMappingURL=IntersectionTypeFormatter.js.map