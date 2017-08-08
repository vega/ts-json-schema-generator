"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class UnknownTypeError extends BaseError_1.BaseError {
    constructor(type) {
        super();
        this.type = type;
    }
    get name() {
        return "UnknownTypeError";
    }
    get message() {
        return `Unknown type "${this.type.getId()}"`;
    }
    getType() {
        return this.type;
    }
}
exports.UnknownTypeError = UnknownTypeError;
//# sourceMappingURL=UnknownTypeError.js.map