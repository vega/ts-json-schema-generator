"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicError = void 0;
const BaseError_1 = require("./BaseError");
class LogicError extends BaseError_1.BaseError {
    constructor(msg) {
        super(msg);
        this.msg = msg;
    }
}
exports.LogicError = LogicError;
//# sourceMappingURL=LogicError.js.map