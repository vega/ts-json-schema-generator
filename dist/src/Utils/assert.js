"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogicError_1 = require("../Error/LogicError");
function assert(value, message) {
    if (!value) {
        throw new LogicError_1.LogicError(message);
    }
}
exports.default = assert;
//# sourceMappingURL=assert.js.map