"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenTypeFormatter = void 0;
const HiddenType_1 = require("../Type/HiddenType");
class HiddenTypeFormatter {
    supportsType(type) {
        return type instanceof HiddenType_1.HiddenType;
    }
    getDefinition(type) {
        return { additionalProperties: false };
    }
    getChildren(type) {
        return [];
    }
}
exports.HiddenTypeFormatter = HiddenTypeFormatter;
//# sourceMappingURL=HiddenTypeFormatter.js.map