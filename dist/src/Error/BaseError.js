"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
/**
 * Base error for ts-json-schema-generator
 */
class BaseError extends Error {
    diagnostic;
    constructor(diagnostic) {
        super(typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        this.diagnostic = BaseError.createDiagnostic(diagnostic);
    }
    static createDiagnostic(diagnostic) {
        // Swap the node for the file, source, start and length properties
        // sourceless nodes cannot be referenced in the diagnostic
        if (diagnostic.node && diagnostic.node.pos !== -1) {
            diagnostic.file = diagnostic.node.getSourceFile();
            diagnostic.start = diagnostic.node.getStart();
            diagnostic.length = diagnostic.node.getWidth();
            diagnostic.node = undefined;
        }
        // @ts-expect-error - Differentiates from errors from the TypeScript compiler
        // error TSJ - 100: message
        diagnostic.code = `J - ${diagnostic.code}`;
        return Object.assign({
            category: typescript_1.default.DiagnosticCategory.Error,
            file: undefined,
            length: 0,
            start: 0,
        }, diagnostic);
    }
    format(isTTY = process.env.TTY || process.stdout.isTTY) {
        const formatter = isTTY ? typescript_1.default.formatDiagnosticsWithColorAndContext : typescript_1.default.formatDiagnostics;
        return formatter([this.diagnostic], {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => "",
            getNewLine: () => "\n",
        });
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map