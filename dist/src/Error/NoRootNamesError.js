"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRootNamesError = void 0;
const BaseError_1 = require("./BaseError");
class NoRootNamesError extends BaseError_1.BaseError {
    get name() {
        return "NoRootNamesError";
    }
    get message() {
        return `No source files found`;
    }
}
exports.NoRootNamesError = NoRootNamesError;
//# sourceMappingURL=NoRootNamesError.js.map