"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidTypeFormatter = void 0;
const VoidType_js_1 = require("../Type/VoidType.js");
class VoidTypeFormatter {
    supportsType(type) {
        return type instanceof VoidType_js_1.VoidType;
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