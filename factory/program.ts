import * as ts from "typescript";
import * as glob from "glob";
import { DiagnosticError } from "../src/Error/DiagnosticError";

export function createProgram(pathGlob: string): ts.Program {
    const program: ts.Program = ts.createProgram(glob.sync(pathGlob), {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: false,
    });

    const diagnostics: ts.Diagnostic[] = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length) {
        throw new DiagnosticError(diagnostics);
    }

    return program;
}
