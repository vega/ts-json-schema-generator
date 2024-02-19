"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownNodeError = void 0;
const typescript_1 = __importDefault(require("typescript"));
const BaseError_1 = require("./BaseError");
class UnknownNodeError extends BaseError_1.BaseError {
    constructor(node, reference) {
        super(`Unknown node "${node.getSourceFile() ? node.getFullText() : "<unknown>"}" of kind "${typescript_1.default.SyntaxKind[node.kind]}"`);
        this.node = node;
        this.reference = reference;
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