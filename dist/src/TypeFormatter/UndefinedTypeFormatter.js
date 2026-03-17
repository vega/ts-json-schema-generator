"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedTypeFormatter = void 0;
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
class UndefinedTypeFormatter {
    supportsType(type) {
        return type instanceof UndefinedType_js_1.UndefinedType;
    }
    getDefinition(type) {
        return { not: {} };
    }
    getChildren(type) {
        return [];
    }
}
exports.UndefinedTypeFormatter = UndefinedTypeFormatter;
//# sourceMappingURL=UndefinedTypeFormatter.js.map