import ts from "typescript";
import { BaseError } from "./BaseError.js";

export class DiagnosticError extends BaseError {
    public constructor(private diagnostics: readonly ts.Diagnostic[]) {
        super(
            diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n\n"),
        );
    }

    public getDiagnostics(): readonly ts.Diagnostic[] {
        return this.diagnostics;
    }
}
