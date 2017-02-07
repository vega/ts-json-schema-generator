import * as ts from "typescript";
import * as glob from "glob";
import * as path from "path";

import { Config } from "../src/Config";
import { DiagnosticError } from "../src/Error/DiagnosticError";

export function createProgram(config: Config): ts.Program {
    const pathGlob: string = path.resolve(config.path);
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
