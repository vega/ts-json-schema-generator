"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = createProgram;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("node:path"));
const glob_1 = require("glob");
const normalize_path_1 = tslib_1.__importDefault(require("normalize-path"));
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../src/Error/Errors.js");
function loadTsConfigFile(configFile) {
    const raw = typescript_1.default.sys.readFile(configFile);
    if (!raw) {
        throw new Errors_js_1.BuildError({
            messageText: `Cannot read config file "${configFile}"`,
        });
    }
    const config = typescript_1.default.parseConfigFileTextToJson(configFile, raw);
    if (config.error) {
        throw new Errors_js_1.BuildError(config.error);
    }
    if (!config.config) {
        throw new Errors_js_1.BuildError({
            messageText: `Invalid parsed config file "${configFile}"`,
        });
    }
    const parseResult = typescript_1.default.parseJsonConfigFileContent(config.config, typescript_1.default.sys, path.resolve(path.dirname(configFile)), {}, configFile);
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;
    delete parseResult.options.declarationDir;
    delete parseResult.options.declarationMap;
    return parseResult;
}
function getTsConfig(config) {
    if (config.tsconfig) {
        return loadTsConfigFile(config.tsconfig);
    }
    return {
        fileNames: [],
        options: {
            noEmit: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            target: typescript_1.default.ScriptTarget.ES2022,
            module: typescript_1.default.ModuleKind.CommonJS,
            strictNullChecks: false,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            esModuleInterop: true,
        },
    };
}
function createProgram(config) {
    // TODO: Switch back to node:fs globSync once Node 20 is EOL (https://github.com/vega/ts-json-schema-generator/issues/2461).
    const rootNamesFromPath = config.path
        ? (0, glob_1.globSync)((0, normalize_path_1.default)(path.resolve(config.path))).map((rootName) => (0, normalize_path_1.default)(rootName))
        : [];
    const tsconfig = getTsConfig(config);
    const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;
    if (!rootNames.length) {
        throw new Errors_js_1.BuildError({
            messageText: "No input files",
        });
    }
    const program = typescript_1.default.createProgram(rootNames, tsconfig.options);
    if (!config.skipTypeCheck) {
        const diagnostics = typescript_1.default.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new Errors_js_1.BuildError({
                messageText: "Type check error",
                relatedInformation: [...diagnostics],
            });
        }
    }
    return program;
}
//# sourceMappingURL=program.js.map