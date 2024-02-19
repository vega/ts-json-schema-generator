"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNever = void 0;
const NeverType_1 = require("../Type/NeverType");
function notNever(x) {
    return !(x instanceof NeverType_1.NeverType);
}
exports.notNever = notNever;
//# sourceMappingURL=notNever.js.map