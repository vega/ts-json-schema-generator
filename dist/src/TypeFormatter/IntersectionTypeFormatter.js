"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionTypeFormatter = void 0;
const ArrayType_1 = require("../Type/ArrayType");
const IntersectionType_1 = require("../Type/IntersectionType");
const TupleType_1 = require("../Type/TupleType");
const allOfDefinition_1 = require("../Utils/allOfDefinition");
const uniqueArray_1 = require("../Utils/uniqueArray");
class IntersectionTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof IntersectionType_1.IntersectionType;
    }
    getDefinition(type) {
        const dependencies = [];
        const nonArrayLikeTypes = [];
        for (const t of type.getTypes()) {
            if (t instanceof ArrayType_1.ArrayType || t instanceof TupleType_1.TupleType) {
                dependencies.push(this.childTypeFormatter.getDefinition(t));
            }
            else {
                nonArrayLikeTypes.push(t);
            }
        }
        if (nonArrayLikeTypes.length) {
            dependencies.push(nonArrayLikeTypes.reduce((0, allOfDefinition_1.getAllOfDefinitionReducer)(this.childTypeFormatter), {
                type: "object",
                additionalProperties: false,
            }));
        }
        return dependencies.length === 1 ? dependencies[0] : { allOf: dependencies };
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)(type
            .getTypes()
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.IntersectionTypeFormatter = IntersectionTypeFormatter;
//# sourceMappingURL=IntersectionTypeFormatter.js.map