"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueTypeArray = void 0;
function uniqueTypeArray(types) {
    const uniqueTypes = new Map();
    for (const type of types) {
        uniqueTypes.set(type.getId(), type);
    }
    return Array.from(uniqueTypes.values());
}
exports.uniqueTypeArray = uniqueTypeArray;
//# sourceMappingURL=uniqueTypeArray.js.map