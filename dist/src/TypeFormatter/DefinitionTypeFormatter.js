"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefinitionType_1 = require("../Type/DefinitionType");
var DefinitionTypeFormatter = (function () {
    function DefinitionTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    DefinitionTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof DefinitionType_1.DefinitionType;
    };
    DefinitionTypeFormatter.prototype.getDefinition = function (type) {
        return { $ref: "#/definitions/" + type.getId() };
    };
    DefinitionTypeFormatter.prototype.getChildren = function (type) {
        return [
            type
        ].concat(this.childTypeFormatter.getChildren(type.getType()));
    };
    return DefinitionTypeFormatter;
}());
exports.DefinitionTypeFormatter = DefinitionTypeFormatter;
//# sourceMappingURL=DefinitionTypeFormatter.js.map