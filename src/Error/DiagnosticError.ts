import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class DiagnosticError extends BaseError {
    public constructor(private diagnostics: ReadonlyArray<ts.Diagnostic>) {
        super();
    }

    public get name(): string {
        return "DiagnosticError";
    }
    public get message(): string {
        return this.diagnostics
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
            .join("\n\n");
    }

    public getDiagnostics() {
        return this.diagnostics;
    }
}
