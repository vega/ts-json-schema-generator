"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceTypeFormatter = void 0;
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const ReferenceType_js_1 = require("../Type/ReferenceType.js");
class ReferenceTypeFormatter {
    childTypeFormatter;
    encodeRefs;
    constructor(childTypeFormatter, encodeRefs) {
        this.childTypeFormatter = childTypeFormatter;
        this.encodeRefs = encodeRefs;
    }
    supportsType(type) {
        return type instanceof ReferenceType_js_1.ReferenceType;
    }
    getDefinition(type) {
        const ref = type.getName();
        return { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
    }
    getChildren(type) {
        const referredType = type.getType();
        if (referredType instanceof DefinitionType_js_1.DefinitionType) {
            // We probably already have the definitions for the children created so we could return `[]`.
            // There are cases where we may not have (in particular intersections of unions with recursion).
            // To make sure we create the necessary definitions, we return the children of the referred type here.
            // Because we cache definitions, this should not incur any performance impact.
            return this.childTypeFormatter.getChildren(referredType);
        }
        // this means that the referred interface is protected
        // so we have to expose it in the schema definitions
        return this.childTypeFormatter.getChildren(new DefinitionType_js_1.DefinitionType(type.getName(), type.getType()));
    }
}
exports.ReferenceTypeFormatter = ReferenceTypeFormatter;
//# sourceMappingURL=ReferenceTypeFormatter.js.map