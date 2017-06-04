"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseError = (function () {
    function BaseError() {
        this.callStack = new Error().stack;
    }
    Object.defineProperty(BaseError.prototype, "stack", {
        get: function () {
            return this.callStack;
        },
        enumerable: true,
        configurable: true
    });
    return BaseError;
}());
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map