"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRootTypeError = void 0;
const BaseError_1 = require("./BaseError");
class NoRootTypeError extends BaseError_1.BaseError {
    constructor(type) {
        super(`No root type "${type}" found`);
        this.type = type;
    }
    getType() {
        return this.type;
    }
}
exports.NoRootTypeError = NoRootTypeError;
//# sourceMappingURL=NoRootTypeError.js.map