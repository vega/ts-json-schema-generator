"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError {
    constructor() {
        this.callStack = new Error().stack;
    }
    get stack() {
        return this.callStack;
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map