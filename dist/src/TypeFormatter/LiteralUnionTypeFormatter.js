"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LiteralType_1 = require("../Type/LiteralType");
const NullType_1 = require("../Type/NullType");
const UnionType_1 = require("../Type/UnionType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class LiteralUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_1.UnionType && this.isLiteralUnion(type);
    }
    getDefinition(type) {
        const values = uniqueArray_1.uniqueArray(type.getTypes().map((item) => this.getLiteralValue(item)));
        const types = uniqueArray_1.uniqueArray(type.getTypes().map((item) => this.getLiteralType(item)));
        if (types.length === 1) {
            return {
                type: types[0],
                enum: values,
            };
        }
        else {
            return {
                type: types,
                enum: values,
            };
        }
    }
    getChildren(type) {
        return [];
    }
    isLiteralUnion(type) {
        return type.getTypes().every((item) => item instanceof LiteralType_1.LiteralType || item instanceof NullType_1.NullType);
    }
    getLiteralValue(value) {
        return value.getId() === "null" ? null : value.getValue();
    }
    getLiteralType(value) {
        return value.getId() === "null" ? "null" : typeof value.getValue();
    }
}
exports.LiteralUnionTypeFormatter = LiteralUnionTypeFormatter;
//# sourceMappingURL=LiteralUnionTypeFormatter.js.map