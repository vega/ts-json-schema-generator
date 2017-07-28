"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BooleanType_1 = require("../Type/BooleanType");
class BooleanTypeFormatter {
    supportsType(type) {
        return type instanceof BooleanType_1.BooleanType;
    }
    getDefinition(type) {
        return { type: "boolean" };
    }
    getChildren(type) {
        return [];
    }
}
exports.BooleanTypeFormatter = BooleanTypeFormatter;
//# sourceMappingURL=BooleanTypeFormatter.js.map