"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralUnionTypeFormatter = void 0;
const LiteralType_1 = require("../Type/LiteralType");
const NullType_1 = require("../Type/NullType");
const UnionType_1 = require("../Type/UnionType");
const typeName_1 = require("../Utils/typeName");
const uniqueArray_1 = require("../Utils/uniqueArray");
class LiteralUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_1.UnionType && type.getTypes().length > 0 && this.isLiteralUnion(type);
    }
    getDefinition(type) {
        const values = (0, uniqueArray_1.uniqueArray)(type.getTypes().map((item) => this.getLiteralValue(item)));
        const types = (0, uniqueArray_1.uniqueArray)(type.getTypes().map((item) => this.getLiteralType(item)));
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
        return value instanceof LiteralType_1.LiteralType ? value.getValue() : null;
    }
    getLiteralType(value) {
        return value instanceof LiteralType_1.LiteralType ? (0, typeName_1.typeName)(value.getValue()) : "null";
    }
}
exports.LiteralUnionTypeFormatter = LiteralUnionTypeFormatter;
//# sourceMappingURL=LiteralUnionTypeFormatter.js.map