"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTypeFormatter = void 0;
const StringType_1 = require("../Type/StringType");
class StringTypeFormatter {
    supportsType(type) {
        return type instanceof StringType_1.StringType;
    }
    getDefinition(type) {
        return { type: "string" };
    }
    getChildren(type) {
        return [];
    }
}
exports.StringTypeFormatter = StringTypeFormatter;
//# sourceMappingURL=StringTypeFormatter.js.map