"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LiteralType_1 = require("../Type/LiteralType");
const UnionType_1 = require("../Type/UnionType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class LiteralUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_1.UnionType && this.isLiteralUnion(type);
    }
    getDefinition(type) {
        const values = uniqueArray_1.uniqueArray(type.getTypes().map((item) => item.getValue()));
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
        return type.getTypes().every((item) => item instanceof LiteralType_1.LiteralType);
    }
    getLiteralType(value) {
        return value.getValue() === null ? "null" : typeof value.getValue();
    }
}
exports.LiteralUnionTypeFormatter = LiteralUnionTypeFormatter;
//# sourceMappingURL=LiteralUnionTypeFormatter.js.map