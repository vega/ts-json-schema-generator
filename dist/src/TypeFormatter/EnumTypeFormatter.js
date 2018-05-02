"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EnumType_1 = require("../Type/EnumType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class EnumTypeFormatter {
    supportsType(type) {
        return type instanceof EnumType_1.EnumType;
    }
    getDefinition(type) {
        const values = uniqueArray_1.uniqueArray(type.getValues());
        const types = uniqueArray_1.uniqueArray(values.map((value) => this.getValueType(value)));
        return {
            type: types.length === 1 ? types[0] : types,
            enum: values,
        };
    }
    getChildren(type) {
        return [];
    }
    getValueType(value) {
        return value === null ? "null" : typeof value;
    }
}
exports.EnumTypeFormatter = EnumTypeFormatter;
//# sourceMappingURL=EnumTypeFormatter.js.map