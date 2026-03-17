"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = removeUndefined;
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("./derefType.js");
const preserveAnnotation_js_1 = require("./preserveAnnotation.js");
/**
 * Remove undefined types from union type. Returns the number of non-undefined properties.
 */
function removeUndefined(propertyType) {
    const types = [];
    let numRemoved = 0;
    for (const type of propertyType.getTypes()) {
        const newType = (0, derefType_js_1.derefAnnotatedType)(type);
        if (newType instanceof UndefinedType_js_1.UndefinedType) {
            numRemoved++;
        }
        else if (newType instanceof UnionType_js_1.UnionType) {
            const result = removeUndefined(newType);
            numRemoved += result.numRemoved;
            types.push((0, preserveAnnotation_js_1.preserveAnnotation)(type, result.newType));
        }
        else {
            types.push(type);
        }
    }
    const newType = types.length == 0 ? new UndefinedType_js_1.UndefinedType() : types.length == 1 ? types[0] : new UnionType_js_1.UnionType(types);
    return {
        numRemoved,
        newType,
    };
}
//# sourceMappingURL=removeUndefined.js.map