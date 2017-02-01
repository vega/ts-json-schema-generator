import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class DiagnosticError extends BaseError {
    public constructor(private diagnostics: ts.Diagnostic[]) {
        super();
    }

    public get name(): string {
        return "DiagnosticError";
    }
    public get message(): string {
        return this.diagnostics
            .map((diagnostic: ts.Diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
            .join("\n\n");
    }

    public getDiagnostics(): ts.Diagnostic[] {
        return this.diagnostics;
    }
}
