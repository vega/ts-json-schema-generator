"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyTypeFormatter = void 0;
const AnyType_1 = require("../Type/AnyType");
class AnyTypeFormatter {
    supportsType(type) {
        return type instanceof AnyType_1.AnyType;
    }
    getDefinition(type) {
        return {};
    }
    getChildren(type) {
        return [];
    }
}
exports.AnyTypeFormatter = AnyTypeFormatter;
//# sourceMappingURL=AnyTypeFormatter.js.map