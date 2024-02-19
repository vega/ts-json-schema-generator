"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.narrowType = void 0;
const EnumType_1 = require("../Type/EnumType");
const NeverType_1 = require("../Type/NeverType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("./derefType");
function narrowType(type, predicate) {
    const derefed = (0, derefType_1.derefType)(type);
    if (derefed instanceof UnionType_1.UnionType || derefed instanceof EnumType_1.EnumType) {
        let changed = false;
        const types = [];
        for (const sub of derefed.getTypes()) {
            const derefedSub = (0, derefType_1.derefType)(sub);
            const narrowed = narrowType(derefedSub, predicate);
            if (!(narrowed instanceof NeverType_1.NeverType)) {
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
        if (changed) {
            if (types.length === 0) {
                return new NeverType_1.NeverType();
            }
            else if (types.length === 1) {
                return types[0];
            }
            else {
                return new UnionType_1.UnionType(types);
            }
        }
        return type;
    }
    return predicate(derefed) ? type : new NeverType_1.NeverType();
}
exports.narrowType = narrowType;
//# sourceMappingURL=narrowType.js.map