"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullTypeFormatter = void 0;
const NullType_js_1 = require("../Type/NullType.js");
class NullTypeFormatter {
    supportsType(type) {
        return type instanceof NullType_js_1.NullType;
    }
    getDefinition(type) {
        return { type: "null" };
    }
    getChildren(type) {
        return [];
    }
}
exports.NullTypeFormatter = NullTypeFormatter;
//# sourceMappingURL=NullTypeFormatter.js.map