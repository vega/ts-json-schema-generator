"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberTypeFormatter = void 0;
const NumberType_js_1 = require("../Type/NumberType.js");
class NumberTypeFormatter {
    supportsType(type) {
        return type instanceof NumberType_js_1.NumberType;
    }
    getDefinition(type) {
        return { type: "number" };
    }
    getChildren(type) {
        return [];
    }
}
exports.NumberTypeFormatter = NumberTypeFormatter;
//# sourceMappingURL=NumberTypeFormatter.js.map