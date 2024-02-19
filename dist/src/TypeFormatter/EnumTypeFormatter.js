"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTypeFormatter = void 0;
const EnumType_1 = require("../Type/EnumType");
const typeName_1 = require("../Utils/typeName");
const uniqueArray_1 = require("../Utils/uniqueArray");
class EnumTypeFormatter {
    supportsType(type) {
        return type instanceof EnumType_1.EnumType;
    }
    getDefinition(type) {
        const values = (0, uniqueArray_1.uniqueArray)(type.getValues());
        const types = (0, uniqueArray_1.uniqueArray)(values.map(typeName_1.typeName));
        return values.length === 1
            ? { type: types[0], const: values[0] }
            : { type: types.length === 1 ? types[0] : types, enum: values };
    }
    getChildren(type) {
        return [];
    }
}
exports.EnumTypeFormatter = EnumTypeFormatter;
//# sourceMappingURL=EnumTypeFormatter.js.map