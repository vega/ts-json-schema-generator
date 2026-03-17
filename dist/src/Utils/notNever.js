"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNever = notNever;
const NeverType_js_1 = require("../Type/NeverType.js");
function notNever(x) {
    return !(x instanceof NeverType_js_1.NeverType);
}
//# sourceMappingURL=notNever.js.map