"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionTypeFormatter = void 0;
const DefinitionType_1 = require("../Type/DefinitionType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class DefinitionTypeFormatter {
    constructor(childTypeFormatter, encodeRefs) {
        this.childTypeFormatter = childTypeFormatter;
        this.encodeRefs = encodeRefs;
    }
    supportsType(type) {
        return type instanceof DefinitionType_1.DefinitionType;
    }
    getDefinition(type) {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}
exports.DefinitionTypeFormatter = DefinitionTypeFormatter;
//# sourceMappingURL=DefinitionTypeFormatter.js.map