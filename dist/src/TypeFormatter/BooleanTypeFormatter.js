"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTypeFormatter = void 0;
const BooleanType_js_1 = require("../Type/BooleanType.js");
class BooleanTypeFormatter {
    supportsType(type) {
        return type instanceof BooleanType_js_1.BooleanType;
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