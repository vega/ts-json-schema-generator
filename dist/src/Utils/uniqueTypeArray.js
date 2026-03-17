"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueTypeArray = uniqueTypeArray;
function uniqueTypeArray(types) {
    const uniqueTypes = new Map();
    for (const type of types) {
        uniqueTypes.set(type.getId(), type);
    }
    return Array.from(uniqueTypes.values());
}
//# sourceMappingURL=uniqueTypeArray.js.map