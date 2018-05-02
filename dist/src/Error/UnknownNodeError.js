"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class UnknownNodeError extends BaseError_1.BaseError {
    constructor(node, reference) {
        super();
        this.node = node;
        this.reference = reference;
    }
    get name() {
        return "UnknownNodeError";
    }
    get message() {
        return `Unknown node`;
    }
    getNode() {
        return this.node;
    }
    getReference() {
        return this.reference;
    }
}
exports.UnknownNodeError = UnknownNodeError;
//# sourceMappingURL=UnknownNodeError.js.map