"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTypeFormatter = void 0;
exports.toEnumType = toEnumType;
const EnumType_js_1 = require("../Type/EnumType.js");
const typeName_js_1 = require("../Utils/typeName.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
class EnumTypeFormatter {
    supportsType(type) {
        return type instanceof EnumType_js_1.EnumType;
    }
    getDefinition(type) {
        const values = (0, uniqueArray_js_1.uniqueArray)(type.getValues());
        const types = (0, uniqueArray_js_1.uniqueArray)(values.map(typeName_js_1.typeName));
        // NOTE: We want to use "const" when referencing an enum member.
        // However, this formatter is used both for enum members and enum types,
        // so the side effect is that an enum type that contains just a single
        // value is represented as "const" too.
        return values.length === 1 ? { type: types[0], const: values[0] } : { type: toEnumType(types), enum: values };
    }
    getChildren(type) {
        return [];
    }
}
exports.EnumTypeFormatter = EnumTypeFormatter;
/**
 * Unwraps the array if it contains only one type.
 */
function toEnumType(types) {
    if (types.length === 1) {
        return types[0];
    }
    return types;
}
//# sourceMappingURL=EnumTypeFormatter.js.map