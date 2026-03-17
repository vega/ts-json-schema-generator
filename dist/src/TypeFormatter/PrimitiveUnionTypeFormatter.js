"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveUnionTypeFormatter = void 0;
const Errors_js_1 = require("../Error/Errors.js");
const BooleanType_js_1 = require("../Type/BooleanType.js");
const NullType_js_1 = require("../Type/NullType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
class PrimitiveUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_js_1.UnionType && type.getTypes().length > 0 && this.isPrimitiveUnion(type);
    }
    getDefinition(type) {
        return {
            type: (0, uniqueArray_js_1.uniqueArray)(type.getTypes().map((item) => this.getPrimitiveType(item))),
        };
    }
    getChildren(type) {
        return [];
    }
    isPrimitiveUnion(type) {
        return type
            .getTypes()
            .every((item) => item instanceof StringType_js_1.StringType ||
            item instanceof NumberType_js_1.NumberType ||
            item instanceof BooleanType_js_1.BooleanType ||
            item instanceof NullType_js_1.NullType);
    }
    getPrimitiveType(item) {
        if (item instanceof StringType_js_1.StringType) {
            return "string";
        }
        if (item instanceof NumberType_js_1.NumberType) {
            return "number";
        }
        if (item instanceof BooleanType_js_1.BooleanType) {
            return "boolean";
        }
        if (item instanceof NullType_js_1.NullType) {
            return "null";
        }
        throw new Errors_js_1.JsonTypeError("Unexpected code branch", item);
    }
}
exports.PrimitiveUnionTypeFormatter = PrimitiveUnionTypeFormatter;
//# sourceMappingURL=PrimitiveUnionTypeFormatter.js.map