import * as findUp from "find-up";
import * as glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import { Config } from "../src/Config";
import { DiagnosticError } from "../src/Error/DiagnosticError";
import { LogicError } from "../src/Error/LogicError";
import { NoRootNamesError } from "../src/Error/NoRootNamesError";

function getDefaultTsConfig() {
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

function loadTsConfigFile(configFile: string) {
    const config = ts.parseConfigFileTextToJson(
        configFile,
        ts.sys.readFile(configFile)!,
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

    return parseResult;
}

function getTsConfigFilepath({ tsconfig }: Config, rootNames: string[]) {
    if (tsconfig) {
        return tsconfig;
    }
    if (rootNames.length) {
        const found = findUp.sync("tsconfig.json", { cwd: rootNames[0] });
        if (found) {
            return found;
        }
    }
    return;
}

function getTsConfig(config: Config, rootNames: string[]) {
    const configFile = getTsConfigFilepath(config, rootNames);
    if (configFile) {
        return loadTsConfigFile(configFile);
    }
    return getDefaultTsConfig();
}

export function createProgram(config: Config): ts.Program {
    const rootNamesFromPath = config.path ? glob.sync(path.resolve(config.path)) : [];
    const tsconfig = getTsConfig(config, rootNamesFromPath);
    const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;

    if (!rootNames.length) {
        throw new NoRootNamesError();
    }

    const program: ts.Program = ts.createProgram(
        rootNames,
        tsconfig.options,
    );

    if (!config.skipTypeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError(diagnostics);
        }
    }

    return program;
}
