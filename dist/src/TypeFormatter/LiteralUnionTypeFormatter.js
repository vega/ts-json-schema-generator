"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralUnionTypeFormatter = void 0;
exports.isLiteralUnion = isLiteralUnion;
const EnumType_js_1 = require("../Type/EnumType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NullType_js_1 = require("../Type/NullType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const typeName_js_1 = require("../Utils/typeName.js");
const EnumTypeFormatter_js_1 = require("./EnumTypeFormatter.js");
class LiteralUnionTypeFormatter {
    supportsType(type) {
        return type instanceof UnionType_js_1.UnionType && type.getTypes().length > 0 && isLiteralUnion(type);
    }
    getDefinition(unionType) {
        let hasString = false;
        let preserveLiterals = false;
        let allStrings = true;
        let hasNull = false;
        const literals = unionType.getFlattenedTypes();
        // filter out String types since we need to be more careful about them
        const types = literals.filter((literal) => {
            if (literal instanceof StringType_js_1.StringType) {
                hasString = true;
                preserveLiterals ||= literal.getPreserveLiterals();
                return false;
            }
            if (literal instanceof NullType_js_1.NullType) {
                hasNull = true;
                return true;
            }
            if (literal instanceof LiteralType_js_1.LiteralType && !literal.isString()) {
                allStrings = false;
            }
            return true;
        });
        if (allStrings && hasString && !preserveLiterals) {
            return hasNull ? { type: ["string", "null"] } : { type: "string" };
        }
        const typeValues = new Set();
        const typeNames = new Set();
        for (const type of types) {
            appendTypeNames(type, typeNames);
            appendTypeValues(type, typeValues);
        }
        const schema = typeNames.size === 1 && typeValues.size === 1
            ? {
                type: (0, EnumTypeFormatter_js_1.toEnumType)(Array.from(typeNames)),
                const: Array.from(typeValues)[0],
            }
            : {
                type: (0, EnumTypeFormatter_js_1.toEnumType)(Array.from(typeNames)),
                enum: Array.from(typeValues),
            };
        return hasString ? { anyOf: [{ type: "string" }, schema] } : schema;
    }
    getChildren() {
        return [];
    }
}
exports.LiteralUnionTypeFormatter = LiteralUnionTypeFormatter;
function isLiteralUnion(type) {
    return type
        .getFlattenedTypes()
        .every((item) => item instanceof LiteralType_js_1.LiteralType ||
        item instanceof NullType_js_1.NullType ||
        item instanceof StringType_js_1.StringType ||
        item instanceof EnumType_js_1.EnumType);
}
/**
 * Appends all possible type names of a type to the given set.
 */
function appendTypeNames(type, names) {
    if (type instanceof EnumType_js_1.EnumType) {
        for (const value of type.getValues()) {
            names.add((0, typeName_js_1.typeName)(value));
        }
        return;
    }
    if (type instanceof LiteralType_js_1.LiteralType) {
        names.add((0, typeName_js_1.typeName)(type.getValue()));
        return;
    }
    names.add((0, typeName_js_1.typeName)(null));
}
/**
 * Appends all possible values of a type to the given set.
 */
function appendTypeValues(type, values) {
    if (type instanceof EnumType_js_1.EnumType) {
        for (const value of type.getValues()) {
            values.add(value);
        }
        return;
    }
    if (type instanceof LiteralType_js_1.LiteralType) {
        values.add(type.getValue());
        return;
    }
    values.add(null);
}
//# sourceMappingURL=LiteralUnionTypeFormatter.js.map