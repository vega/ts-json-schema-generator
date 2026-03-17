"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionTypeFormatter = void 0;
const ArrayType_js_1 = require("../Type/ArrayType.js");
const IntersectionType_js_1 = require("../Type/IntersectionType.js");
const TupleType_js_1 = require("../Type/TupleType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const allOfDefinition_js_1 = require("../Utils/allOfDefinition.js");
const derefType_js_1 = require("../Utils/derefType.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
/**
 * Recursively flatten nested IntersectionType members so each leaf type is
 * reduced individually. This prevents CircularReferenceTypeFormatter from
 * caching incomplete intermediate IntersectionType definitions when one of the
 * members triggers a circular reference (e.g. a type with recursive fields).
 */
function flattenIntersectionMembers(types) {
    const result = [];
    for (const t of types) {
        const derefed = (0, derefType_js_1.derefType)(t);
        if (derefed instanceof IntersectionType_js_1.IntersectionType) {
            result.push(...flattenIntersectionMembers(derefed.getTypes()));
        }
        else {
            result.push(t);
        }
    }
    return result;
}
class IntersectionTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof IntersectionType_js_1.IntersectionType;
    }
    getDefinition(type, options) {
        const refResolver = (0, allOfDefinition_js_1.refResolverFromDefinitions)(options?.definitions);
        const reducer = (0, allOfDefinition_js_1.getAllOfDefinitionReducer)(this.childTypeFormatter, refResolver, options);
        const dependencies = [];
        const nonArrayLikeTypes = [];
        const flatMembers = flattenIntersectionMembers(type.getTypes());
        for (const t of flatMembers) {
            // Filter out Array like definitions that cannot be
            // easily mergeable into a single json-schema object
            if (t instanceof ArrayType_js_1.ArrayType || t instanceof TupleType_js_1.TupleType) {
                dependencies.push(this.childTypeFormatter.getDefinition(t, options));
            }
            else {
                nonArrayLikeTypes.push(t);
            }
        }
        if (nonArrayLikeTypes.length) {
            // There are non array (mergeable requirements)
            const unionTypes = nonArrayLikeTypes
                .map((t) => (0, derefType_js_1.derefType)(t))
                .filter((t) => t instanceof UnionType_js_1.UnionType);
            const unionMember = unionTypes[0];
            const nonUnionMembers = nonArrayLikeTypes.filter((t) => !((0, derefType_js_1.derefType)(t) instanceof UnionType_js_1.UnionType));
            if (!unionMember) {
                dependencies.push(nonArrayLikeTypes.reduce(reducer, {
                    type: "object",
                    additionalProperties: false,
                }));
            }
            else {
                const base = nonUnionMembers.reduce(reducer, { type: "object", additionalProperties: false });
                const branchDefs = unionMember.getTypes().flatMap((branchType) => {
                    const derefed = (0, derefType_js_1.derefType)(branchType);
                    if (derefed instanceof UnionType_js_1.UnionType) {
                        return derefed.getTypes().map((innerType) => [innerType].reduce(reducer, { ...base }));
                    }
                    return [[branchType].reduce(reducer, { ...base })];
                });
                dependencies.push(branchDefs.length === 1 ? branchDefs[0] : { anyOf: branchDefs });
            }
        }
        return dependencies.length === 1 ? dependencies[0] : { allOf: dependencies };
    }
    getChildren(type) {
        return (0, uniqueArray_js_1.uniqueArray)(type
            .getTypes()
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.IntersectionTypeFormatter = IntersectionTypeFormatter;
//# sourceMappingURL=IntersectionTypeFormatter.js.map