"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class LogicError extends BaseError_1.BaseError {
    constructor(msg) {
        super();
        this.msg = msg;
    }
    get name() {
        return "LogicError";
    }
    get message() {
        return this.msg;
    }
}
exports.LogicError = LogicError;
//# sourceMappingURL=LogicError.js.map