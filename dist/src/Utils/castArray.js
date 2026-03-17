"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castArray = castArray;
function castArray(input) {
    if (input === undefined) {
        return undefined;
    }
    return Array.isArray(input) ? input : [input];
}
//# sourceMappingURL=castArray.js.map