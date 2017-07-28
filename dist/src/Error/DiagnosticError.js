"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const BaseError_1 = require("./BaseError");
class DiagnosticError extends BaseError_1.BaseError {
    constructor(diagnostics) {
        super();
        this.diagnostics = diagnostics;
    }
    get name() {
        return "DiagnosticError";
    }
    get message() {
        return this.diagnostics
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
            .join("\n\n");
    }
    getDiagnostics() {
        return this.diagnostics;
    }
}
exports.DiagnosticError = DiagnosticError;
//# sourceMappingURL=DiagnosticError.js.map