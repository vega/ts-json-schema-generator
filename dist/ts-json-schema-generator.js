"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const safe_stable_stringify_1 = tslib_1.__importDefault(require("safe-stable-stringify"));
const typescript_1 = require("typescript");
const generator_js_1 = require("./factory/generator.js");
const BaseError_js_1 = require("./src/Error/BaseError.js");
const package_json_1 = tslib_1.__importDefault(require("./package.json"));
const args = new commander_1.Command()
    .option("-p, --path <path>", "Source file path")
    .option("-t, --type <name...>", "Type name(s)")
    .option("-i, --id <name>", "$id for generated schema")
    .option("-f, --tsconfig <path>", "Custom tsconfig.json path")
    .addOption(new commander_1.Option("-e, --expose <expose>", "Type exposing").choices(["all", "none", "export"]).default("export"))
    .addOption(new commander_1.Option("-j, --jsDoc <extended>", "Read JSDoc annotations")
    .choices(["none", "basic", "extended"])
    .default("extended"))
    .addOption(new commander_1.Option("--markdown-description", "Generate `markdownDescription` in addition to `description`.").implies({
    jsDoc: "extended",
}))
    .addOption(new commander_1.Option("--full-description", "Include the full raw JSDoc comment as `fullDescription` in the schema.").implies({
    jsDoc: "extended",
}))
    .addOption(new commander_1.Option("--functions <functions>", "How to handle functions. `fail` will throw an error. `comment` will add a comment. `hide` will treat the function like a NeverType or HiddenType.")
    .choices(["fail", "comment", "hide"])
    .default("comment"))
    .option("--minify", "Minify generated schema", false)
    .option("--unstable", "Do not sort properties")
    .option("--strict-tuples", "Do not allow additional items on tuples")
    .option("--no-top-ref", "Do not create a top-level $ref definition")
    .option("--no-type-check", "Skip type checks to improve performance")
    .option("--no-ref-encode", "Do not encode references")
    .option("-o, --out <file>", "Set the output file (default: stdout)")
    .option("--validation-keywords [value]", "Provide additional validation keywords to include", (value, list) => list.concat(value), [])
    .option("--additional-properties", "Allow additional properties for objects with no index signature", false)
    .version(package_json_1.default.version)
    .parse(process.argv)
    .opts();
const config = {
    minify: args.minify,
    path: args.path,
    tsconfig: typeof args.tsconfig === "string" ? args.tsconfig : (0, typescript_1.findConfigFile)(process.cwd(), (f) => typescript_1.sys.fileExists(f)),
    type: args.type,
    schemaId: args.id,
    expose: args.expose,
    topRef: args.topRef,
    jsDoc: args.jsDoc,
    markdownDescription: args.markdownDescription,
    fullDescription: args.fullDescription,
    sortProps: !args.unstable,
    strictTuples: args.strictTuples,
    skipTypeCheck: !args.typeCheck,
    encodeRefs: args.refEncode,
    extraTags: args.validationKeywords,
    additionalProperties: args.additionalProperties,
    functions: args.functions,
};
try {
    const schema = (0, generator_js_1.createGenerator)(config).createSchema(config.type);
    const stringify = config.sortProps ? safe_stable_stringify_1.default : JSON.stringify;
    // need as string since TS can't figure out that the string | undefined case doesn't happen
    const schemaString = (config.minify ? stringify(schema) : stringify(schema, null, 2));
    if (args.out) {
        // write to file
        const outPath = (0, node_path_1.dirname)(args.out);
        (0, node_fs_1.mkdirSync)(outPath, { recursive: true });
        (0, node_fs_1.writeFileSync)(args.out, schemaString);
    }
    else {
        // write to stdout
        console.log(`${schemaString}\n`);
    }
}
catch (error) {
    if (error instanceof BaseError_js_1.BaseError) {
        console.error(error.format());
        if (error.cause) {
            console.error(error.cause);
        }
        else if (error.stack) {
            console.debug(error.stack);
        }
        // Maybe we are being imported by another script
        process.exitCode = 1;
    }
    else {
        throw error;
    }
}
//# sourceMappingURL=ts-json-schema-generator.js.map