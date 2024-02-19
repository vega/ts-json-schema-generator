"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeverTypeFormatter = void 0;
const NeverType_1 = require("../Type/NeverType");
class NeverTypeFormatter {
    supportsType(type) {
        return type instanceof NeverType_1.NeverType;
    }
    getDefinition(type) {
        return { not: {} };
    }
    getChildren(type) {
        return [];
    }
}
exports.NeverTypeFormatter = NeverTypeFormatter;
//# sourceMappingURL=NeverTypeFormatter.js.map