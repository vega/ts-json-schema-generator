"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
const UndefinedType_1 = require("../Type/UndefinedType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("./derefType");
const preserveAnnotation_1 = require("./preserveAnnotation");
function removeUndefined(propertyType) {
    const types = [];
    let numRemoved = 0;
    for (const type of propertyType.getTypes()) {
        const newType = (0, derefType_1.derefAnnotatedType)(type);
        if (newType instanceof UndefinedType_1.UndefinedType) {
            numRemoved += 1;
        }
        else if (newType instanceof UnionType_1.UnionType) {
            const result = removeUndefined(newType);
            numRemoved += result.numRemoved;
            types.push((0, preserveAnnotation_1.preserveAnnotation)(type, result.newType));
        }
        else {
            types.push(type);
        }
    }
    const newType = types.length == 0 ? new UndefinedType_1.UndefinedType() : types.length == 1 ? types[0] : new UnionType_1.UnionType(types);
    return {
        numRemoved,
        newType,
    };
}
exports.removeUndefined = removeUndefined;
//# sourceMappingURL=removeUndefined.js.map