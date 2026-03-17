"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionOfArrays = intersectionOfArrays;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
const safe_stable_stringify_1 = tslib_1.__importDefault(require("safe-stable-stringify"));
function intersectionOfArrays(a, b) {
    const output = [];
    const inA = new Set(a.map((item) => (0, safe_stable_stringify_1.default)(item)));
    for (const value of b) {
        if (inA.has((0, safe_stable_stringify_1.default)(value))) {
            output.push(value);
        }
    }
    return output;
}
//# sourceMappingURL=intersectionOfArrays.js.map