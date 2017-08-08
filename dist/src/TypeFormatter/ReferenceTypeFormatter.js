"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefinitionType_1 = require("../Type/DefinitionType");
const ReferenceType_1 = require("../Type/ReferenceType");
class ReferenceTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ReferenceType_1.ReferenceType;
    }
    getDefinition(type) {
        return { $ref: "#/definitions/" + type.getId() };
    }
    getChildren(type) {
        if (type.getType() instanceof DefinitionType_1.DefinitionType) {
            return [];
        }
        return this.childTypeFormatter.getChildren(new DefinitionType_1.DefinitionType(type.getId(), type.getType()));
    }
}
exports.ReferenceTypeFormatter = ReferenceTypeFormatter;
//# sourceMappingURL=ReferenceTypeFormatter.js.map