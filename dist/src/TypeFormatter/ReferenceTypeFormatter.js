"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceTypeFormatter = void 0;
const DefinitionType_1 = require("../Type/DefinitionType");
const ReferenceType_1 = require("../Type/ReferenceType");
class ReferenceTypeFormatter {
    constructor(childTypeFormatter, encodeRefs) {
        this.childTypeFormatter = childTypeFormatter;
        this.encodeRefs = encodeRefs;
    }
    supportsType(type) {
        return type instanceof ReferenceType_1.ReferenceType;
    }
    getDefinition(type) {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    getChildren(type) {
        const referredType = type.getType();
        if (referredType instanceof DefinitionType_1.DefinitionType) {
            return this.childTypeFormatter.getChildren(referredType);
        }
        return this.childTypeFormatter.getChildren(new DefinitionType_1.DefinitionType(type.getName(), type.getType()));
    }
}
exports.ReferenceTypeFormatter = ReferenceTypeFormatter;
//# sourceMappingURL=ReferenceTypeFormatter.js.map