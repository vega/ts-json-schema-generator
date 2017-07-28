"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefinitionType_1 = require("../Type/DefinitionType");
class DefinitionTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof DefinitionType_1.DefinitionType;
    }
    getDefinition(type) {
        return { $ref: "#/definitions/" + type.getId() };
    }
    getChildren(type) {
        return [
            type,
            ...this.childTypeFormatter.getChildren(type.getType()),
        ];
    }
}
exports.DefinitionTypeFormatter = DefinitionTypeFormatter;
//# sourceMappingURL=DefinitionTypeFormatter.js.map