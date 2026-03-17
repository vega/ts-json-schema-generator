"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralTypeFormatter = void 0;
const LiteralType_js_1 = require("../Type/LiteralType.js");
const typeName_js_1 = require("../Utils/typeName.js");
class LiteralTypeFormatter {
    supportsType(type) {
        return type instanceof LiteralType_js_1.LiteralType;
    }
    getDefinition(type) {
        return {
            type: (0, typeName_js_1.typeName)(type.getValue()),
            const: type.getValue(),
        };
    }
    getChildren(type) {
        return [];
    }
}
exports.LiteralTypeFormatter = LiteralTypeFormatter;
//# sourceMappingURL=LiteralTypeFormatter.js.map