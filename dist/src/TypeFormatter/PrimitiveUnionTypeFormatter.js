"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveUnionTypeFormatter = void 0;
const LogicError_1 = require("../Error/LogicError");
const BooleanType_1 = require("../Type/BooleanType");
const NullType_1 = require("../Type/NullType");
const NumberType_1 = require("../Type/NumberType");
const PrimitiveType_1 = require("../Type/PrimitiveType");
const StringType_1 = require("../Type/StringType");
const UnionType_1 = require("../Type/UnionType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class PrimitiveUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_1.UnionType && type.getTypes().length > 0 && this.isPrimitiveUnion(type);
    }
    getDefinition(type) {
        return {
            type: (0, uniqueArray_1.uniqueArray)(type.getTypes().map((item) => this.getPrimitiveType(item))),
        };
    }
    getChildren(type) {
        return [];
    }
    isPrimitiveUnion(type) {
        return type.getTypes().every((item) => item instanceof PrimitiveType_1.PrimitiveType);
    }
    getPrimitiveType(item) {
        if (item instanceof StringType_1.StringType) {
            return "string";
        }
        else if (item instanceof NumberType_1.NumberType) {
            return "number";
        }
        else if (item instanceof BooleanType_1.BooleanType) {
            return "boolean";
        }
        else if (item instanceof NullType_1.NullType) {
            return "null";
        }
        throw new LogicError_1.LogicError("Unexpected code branch");
    }
}
exports.PrimitiveUnionTypeFormatter = PrimitiveUnionTypeFormatter;
//# sourceMappingURL=PrimitiveUnionTypeFormatter.js.map