import ts from "typescript";
import { BaseError } from "./BaseError";
export declare class DiagnosticError extends BaseError {
    private diagnostics;
    constructor(diagnostics: readonly ts.Diagnostic[]);
    getDiagnostics(): readonly ts.Diagnostic[];
}
