"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.narrowType = narrowType;
const EnumType_js_1 = require("../Type/EnumType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("./derefType.js");
/**
 * Narrows the given type by passing all variants to the given predicate function. So when type is a union type then
 * the predicate function is called for each type within the union and only the types for which this function returns
 * true will remain in the returned type. Union types with only one sub type left are replaced by this one-and-only
 * type. Empty union types are removed completely. Definition types are kept if possible. When in the end none of
 * the type candidates match the predicate then undefined is returned.
 *
 * @param type      - The type to narrow down.
 * @param predicate - The predicate function to filter the type variants. If it returns true then the type variant is
 *                    kept, when returning false it is removed.
 * @return The narrowed down type.
 */
function narrowType(type, predicate) {
    const derefed = (0, derefType_js_1.derefType)(type);
    if (derefed instanceof UnionType_js_1.UnionType || derefed instanceof EnumType_js_1.EnumType) {
        let changed = false;
        const types = [];
        for (const sub of derefed.getTypes()) {
            const derefedSub = (0, derefType_js_1.derefType)(sub);
            // Recursively narrow down all types within the union
            const narrowed = narrowType(derefedSub, predicate);
            if (!(narrowed instanceof NeverType_js_1.NeverType)) {
                if (narrowed === derefedSub) {
                    types.push(sub);
                }
                else {
                    types.push(narrowed);
                    changed = true;
                }
            }
            else {
                changed = true;
            }
        }
        // When union types were changed then return new narrowed-down type, otherwise return the original one to
        // keep definitions
        if (changed) {
            if (types.length === 0) {
                return new NeverType_js_1.NeverType();
            }
            else if (types.length === 1) {
                return types[0];
            }
            else {
                return new UnionType_js_1.UnionType(types);
            }
        }
        return type;
    }
    return predicate(derefed) ? type : new NeverType_js_1.NeverType();
}
//# sourceMappingURL=narrowType.js.map