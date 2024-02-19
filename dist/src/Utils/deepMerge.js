"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = void 0;
const intersectionOfArrays_1 = require("./intersectionOfArrays");
function deepMerge(a, b) {
    const output = { ...a, ...b };
    for (const key in a) {
        if (b.hasOwnProperty(key)) {
            const elementA = a[key];
            const elementB = b[key];
            if (elementA != null &&
                elementB != null &&
                typeof elementA === "object" &&
                typeof elementB === "object" &&
                "type" in elementA &&
                "type" in elementB) {
                if (elementA.type == elementB.type) {
                    const enums = mergeConstsAndEnums(elementA, elementB);
                    if (enums != null) {
                        const isSingle = enums.length === 1;
                        output[key][isSingle ? "const" : "enum"] = isSingle ? enums[0] : enums;
                        delete output[key][isSingle ? "enum" : "const"];
                    }
                }
            }
        }
    }
    return output;
}
exports.deepMerge = deepMerge;
function mergeConstsAndEnums(a, b) {
    const enumA = a.const !== undefined ? [a.const] : a.enum;
    const enumB = b.const !== undefined ? [b.const] : b.enum;
    if (enumA == null && enumB != null) {
        return enumB;
    }
    else if (enumA != null && enumB == null) {
        return enumA;
    }
    else if (enumA != null && enumB != null) {
        return (0, intersectionOfArrays_1.intersectionOfArrays)(enumA, enumB);
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=deepMerge.js.map