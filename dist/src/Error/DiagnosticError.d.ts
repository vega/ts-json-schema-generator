import * as ts from "typescript";
import { BaseError } from "./BaseError";
export declare class DiagnosticError extends BaseError {
    private diagnostics;
    constructor(diagnostics: ts.Diagnostic[]);
    readonly name: string;
    readonly message: string;
    getDiagnostics(): ts.Diagnostic[];
}
