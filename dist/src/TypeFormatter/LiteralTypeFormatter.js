"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LiteralType_1 = require("../Type/LiteralType");
class LiteralTypeFormatter {
    supportsType(type) {
        return type instanceof LiteralType_1.LiteralType;
    }
    getDefinition(type) {
        return {
            type: typeof type.getValue(),
            enum: [type.getValue()],
        };
    }
    getChildren(type) {
        return [];
    }
}
exports.LiteralTypeFormatter = LiteralTypeFormatter;
//# sourceMappingURL=LiteralTypeFormatter.js.map