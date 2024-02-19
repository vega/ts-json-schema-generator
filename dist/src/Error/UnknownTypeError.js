"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownTypeError = void 0;
const BaseError_1 = require("./BaseError");
class UnknownTypeError extends BaseError_1.BaseError {
    constructor(type) {
        super(`Unknown type "${type.getId()}"`);
        this.type = type;
    }
    getType() {
        return this.type;
    }
}
exports.UnknownTypeError = UnknownTypeError;
//# sourceMappingURL=UnknownTypeError.js.map