"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = void 0;
const glob_1 = require("glob");
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const normalize_path_1 = __importDefault(require("normalize-path"));
const DiagnosticError_1 = require("../src/Error/DiagnosticError");
const LogicError_1 = require("../src/Error/LogicError");
const NoRootNamesError_1 = require("../src/Error/NoRootNamesError");
const NoTSConfigError_1 = require("../src/Error/NoTSConfigError");
function loadTsConfigFile(configFile) {
    const raw = typescript_1.default.sys.readFile(configFile);
    if (raw) {
        const config = typescript_1.default.parseConfigFileTextToJson(configFile, raw);
        if (config.error) {
            throw new DiagnosticError_1.DiagnosticError([config.error]);
        }
        else if (!config.config) {
            throw new LogicError_1.LogicError(`Invalid parsed config file "${configFile}"`);
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
    else {
        throw new NoTSConfigError_1.NoTSConfigError();
    }
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
            target: typescript_1.default.ScriptTarget.ES5,
            module: typescript_1.default.ModuleKind.CommonJS,
            strictNullChecks: false,
        },
    };
}
function createProgram(config) {
    const rootNamesFromPath = config.path ? (0, glob_1.globSync)((0, normalize_path_1.default)(path.resolve(config.path))) : [];
    const tsconfig = getTsConfig(config);
    const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;
    if (!rootNames.length) {
        throw new NoRootNamesError_1.NoRootNamesError();
    }
    const program = typescript_1.default.createProgram(rootNames, tsconfig.options);
    if (!config.skipTypeCheck) {
        const diagnostics = typescript_1.default.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError_1.DiagnosticError(diagnostics);
        }
    }
    return program;
}
exports.createProgram = createProgram;
//# sourceMappingURL=program.js.map