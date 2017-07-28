import * as glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import { Config } from "../src/Config";
import { DiagnosticError } from "../src/Error/DiagnosticError";
import { LogicError } from "../src/Error/LogicError";

function createProgramFromConfig(configFile: string): ts.Program {
    const config = ts.parseConfigFileTextToJson(
        configFile,
        ts.sys.readFile(configFile),
    );
    if (config.error) {
        throw new DiagnosticError([config.error]);
    } else if (!config.config) {
        throw new LogicError(`Invalid parsed config file "${configFile}"`);
    }

    const parseResult = ts.parseJsonConfigFileContent(
        config.config,
        ts.sys,
        path.dirname(configFile),
        {},
        configFile,
    );
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;

    return ts.createProgram(
        parseResult.fileNames,
        parseResult.options,
    );
}
function createProgramFromGlob(fileGlob: string): ts.Program {
    return ts.createProgram(glob.sync(path.resolve(fileGlob)), {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: false,
    });
}

export function createProgram(config: Config): ts.Program {
    const program: ts.Program = path.extname(config.path) === ".json" ?
        createProgramFromConfig(config.path) :
        createProgramFromGlob(config.path);

    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length) {
        throw new DiagnosticError(diagnostics);
    }

    return program;
}
