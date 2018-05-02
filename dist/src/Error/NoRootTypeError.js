"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class NoRootTypeError extends BaseError_1.BaseError {
    constructor(type) {
        super();
        this.type = type;
    }
    get name() {
        return "NoRootTypeError";
    }
    get message() {
        return `No root type "${this.type}" found`;
    }
    getType() {
        return this.type;
    }
}
exports.NoRootTypeError = NoRootTypeError;
//# sourceMappingURL=NoRootTypeError.js.map