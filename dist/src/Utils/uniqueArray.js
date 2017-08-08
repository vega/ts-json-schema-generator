"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function uniqueArray(array) {
    return array.reduce((result, item) => {
        if (result.indexOf(item) < 0) {
            result.push(item);
        }
        return result;
    }, []);
}
exports.uniqueArray = uniqueArray;
//# sourceMappingURL=uniqueArray.js.map