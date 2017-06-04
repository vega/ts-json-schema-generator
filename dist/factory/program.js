"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var path = require("path");
var ts = require("typescript");
var DiagnosticError_1 = require("../src/Error/DiagnosticError");
var LogicError_1 = require("../src/Error/LogicError");
function createProgramFromConfig(configFile) {
    var config = ts.parseConfigFileTextToJson(configFile, ts.sys.readFile(configFile));
    if (config.error) {
        throw new DiagnosticError_1.DiagnosticError([config.error]);
    }
    else if (!config.config) {
        throw new LogicError_1.LogicError("Invalid parsed config file \"" + configFile + "\"");
    }
    var parseResult = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile), {}, configFile);
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;
    return ts.createProgram(parseResult.fileNames, parseResult.options);
}
function createProgramFromGlob(fileGlob) {
    return ts.createProgram(glob.sync(path.resolve(fileGlob)), {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: false,
    });
}
function createProgram(config) {
    var program = path.extname(config.path) === ".json" ?
        createProgramFromConfig(config.path) :
        createProgramFromGlob(config.path);
    var diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length) {
        throw new DiagnosticError_1.DiagnosticError(diagnostics);
    }
    return program;
}
exports.createProgram = createProgram;
//# sourceMappingURL=program.js.map