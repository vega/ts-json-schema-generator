import * as glob from "glob";
import * as path from "path";
import ts from "typescript";
import normalize from "normalize-path";

import { CompletedConfig, Config } from "../src/Config";
import { DiagnosticError } from "../src/Error/DiagnosticError";
import { LogicError } from "../src/Error/LogicError";
import { NoRootNamesError } from "../src/Error/NoRootNamesError";
import { NoTSConfigError } from "../src/Error/NoTSConfigError";

function loadTsConfigFile(configFile: string) {
    const raw = ts.sys.readFile(configFile);
    if (raw) {
        const config = ts.parseConfigFileTextToJson(configFile, raw);

        if (config.error) {
            throw new DiagnosticError([config.error]);
        } else if (!config.config) {
            throw new LogicError(`Invalid parsed config file "${configFile}"`);
        }

        const parseResult = ts.parseJsonConfigFileContent(
            config.config,
            ts.sys,
            path.resolve(path.dirname(configFile)),
            {},
            configFile
        );
        parseResult.options.noEmit = true;
        delete parseResult.options.out;
        delete parseResult.options.outDir;
        delete parseResult.options.outFile;
        delete parseResult.options.declaration;
        delete parseResult.options.declarationDir;
        delete parseResult.options.declarationMap;

        return parseResult;
    } else {
        throw new NoTSConfigError();
    }
}

function getTsConfig(config: Config) {
    if (config.tsconfig) {
        return loadTsConfigFile(config.tsconfig);
    }

    return {
        fileNames: [],
        options: {
            noEmit: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            strictNullChecks: false,
        },
    };
}

export function createProgram(config: CompletedConfig): ts.Program {
    const rootNamesFromPath = config.path ? glob.sync(normalize(path.resolve(config.path))) : [];
    const tsconfig = getTsConfig(config);
    const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;

    if (!rootNames.length) {
        throw new NoRootNamesError();
    }

    const program: ts.Program = ts.createProgram(rootNames, tsconfig.options);

    if (!config.skipTypeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError(diagnostics);
        }
    }

    return program;
}
