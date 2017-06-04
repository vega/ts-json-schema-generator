"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefinitionType_1 = require("../Type/DefinitionType");
var ReferenceType_1 = require("../Type/ReferenceType");
var ReferenceTypeFormatter = (function () {
    function ReferenceTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    ReferenceTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof ReferenceType_1.ReferenceType;
    };
    ReferenceTypeFormatter.prototype.getDefinition = function (type) {
        return { $ref: "#/definitions/" + type.getId() };
    };
    ReferenceTypeFormatter.prototype.getChildren = function (type) {
        if (type.getType() instanceof DefinitionType_1.DefinitionType) {
            return [];
        }
        return this.childTypeFormatter.getChildren(new DefinitionType_1.DefinitionType(type.getId(), type.getType()));
    };
    return ReferenceTypeFormatter;
}());
exports.ReferenceTypeFormatter = ReferenceTypeFormatter;
//# sourceMappingURL=ReferenceTypeFormatter.js.map