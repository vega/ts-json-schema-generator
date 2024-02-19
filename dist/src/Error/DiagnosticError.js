"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticError = void 0;
const typescript_1 = __importDefault(require("typescript"));
const BaseError_1 = require("./BaseError");
class DiagnosticError extends BaseError_1.BaseError {
    constructor(diagnostics) {
        super(diagnostics.map((diagnostic) => typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n\n"));
        this.diagnostics = diagnostics;
    }
    getDiagnostics() {
        return this.diagnostics;
    }
}
exports.DiagnosticError = DiagnosticError;
//# sourceMappingURL=DiagnosticError.js.map