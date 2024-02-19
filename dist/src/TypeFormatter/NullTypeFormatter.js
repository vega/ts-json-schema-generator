"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullTypeFormatter = void 0;
const NullType_1 = require("../Type/NullType");
class NullTypeFormatter {
    supportsType(type) {
        return type instanceof NullType_1.NullType;
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