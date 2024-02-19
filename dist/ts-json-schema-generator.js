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
const commander_1 = require("commander");
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
const generator_1 = require("./factory/generator");
const Config_1 = require("./src/Config");
const BaseError_1 = require("./src/Error/BaseError");
const formatError_1 = require("./src/Utils/formatError");
const pkg = __importStar(require("./package.json"));
const path_1 = require("path");
const fs_1 = require("fs");
const args = new commander_1.Command()
    .option("-p, --path <path>", "Source file path")
    .option("-t, --type <name>", "Type name")
    .option("-i, --id <name>", "$id for generated schema")
    .option("-f, --tsconfig <path>", "Custom tsconfig.json path")
    .addOption(new commander_1.Option("-e, --expose <expose>", "Type exposing").choices(["all", "none", "export"]).default("export"))
    .addOption(new commander_1.Option("-j, --jsDoc <extended>", "Read JsDoc annotations")
    .choices(["none", "basic", "extended"])
    .default("extended"))
    .addOption(new commander_1.Option("--markdown-description", "Generate `markdownDescription` in addition to `description`.").implies({
    jsDoc: "extended",
}))
    .option("--minify", "Minify generated schema", false)
    .option("--unstable", "Do not sort properties")
    .option("--strict-tuples", "Do not allow additional items on tuples")
    .option("--no-top-ref", "Do not create a top-level $ref definition")
    .option("--no-type-check", "Skip type checks to improve performance")
    .option("--no-ref-encode", "Do not encode references")
    .option("-o, --out <file>", "Set the output file (default: stdout)")
    .option("--validation-keywords [value]", "Provide additional validation keywords to include", (value, list) => list.concat(value), [])
    .option("--additional-properties", "Allow additional properties for objects with no index signature", false)
    .version(pkg.version)
    .parse(process.argv)
    .opts();
const config = {
    ...Config_1.DEFAULT_CONFIG,
    minify: args.minify,
    path: args.path,
    tsconfig: args.tsconfig,
    type: args.type,
    schemaId: args.id,
    expose: args.expose,
    topRef: args.topRef,
    jsDoc: args.jsDoc,
    markdownDescription: args.markdownDescription,
    sortProps: !args.unstable,
    strictTuples: args.strictTuples,
    skipTypeCheck: !args.typeCheck,
    encodeRefs: args.refEncode,
    extraTags: args.validationKeywords,
    additionalProperties: args.additionalProperties,
};
try {
    const schema = (0, generator_1.createGenerator)(config).createSchema(args.type);
    const stringify = config.sortProps ? safe_stable_stringify_1.default : JSON.stringify;
    const schemaString = (config.minify ? stringify(schema) : stringify(schema, null, 2));
    if (args.out) {
        const outPath = (0, path_1.dirname)(args.out);
        (0, fs_1.mkdirSync)(outPath, { recursive: true });
        (0, fs_1.writeFileSync)(args.out, schemaString);
    }
    else {
        process.stdout.write(`${schemaString}\n`);
    }
}
catch (error) {
    if (error instanceof BaseError_1.BaseError) {
        process.stderr.write((0, formatError_1.formatError)(error));
        process.exit(1);
    }
    else {
        throw error;
    }
}
//# sourceMappingURL=ts-json-schema-generator.js.map