"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalTypeFormatter = void 0;
const OptionalType_1 = require("../Type/OptionalType");
class OptionalTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof OptionalType_1.OptionalType;
    }
    getDefinition(type) {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.OptionalTypeFormatter = OptionalTypeFormatter;
//# sourceMappingURL=OptionalTypeFormatter.js.map