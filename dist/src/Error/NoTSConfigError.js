"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTSConfigError = void 0;
const BaseError_1 = require("./BaseError");
class NoTSConfigError extends BaseError_1.BaseError {
    get name() {
        return "NoTSConfigError";
    }
    get message() {
        return `No tsconfig file found`;
    }
}
exports.NoTSConfigError = NoTSConfigError;
//# sourceMappingURL=NoTSConfigError.js.map