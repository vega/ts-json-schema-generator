"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VoidType_1 = require("../Type/VoidType");
class VoidTypeFormatter {
    supportsType(type) {
        return type instanceof VoidType_1.VoidType;
    }
    getDefinition(type) {
        return { type: "null" };
    }
    getChildren(type) {
        return [];
    }
}
exports.VoidTypeFormatter = VoidTypeFormatter;
//# sourceMappingURL=VoidTypeFormatter.js.map