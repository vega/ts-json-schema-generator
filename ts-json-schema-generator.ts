import { Command, Option } from "commander";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import stableStringify from "safe-stable-stringify";
import { findConfigFile, sys as tsSys } from "typescript";
import { createGenerator } from "./factory/generator.js";
import type { Config } from "./src/Config.js";
import { BaseError } from "./src/Error/BaseError.js";

import pkg from "./package.json";

const args = new Command()
    .option("-p, --path <path>", "Source file path")
    .option("-t, --type <name>", "Type name")
    .option("-i, --id <name>", "$id for generated schema")
    .option("-f, --tsconfig <path>", "Custom tsconfig.json path")
    .addOption(
        new Option("-e, --expose <expose>", "Type exposing").choices(["all", "none", "export"]).default("export"),
    )
    .addOption(
        new Option("-j, --jsDoc <extended>", "Read JsDoc annotations")
            .choices(["none", "basic", "extended"])
            .default("extended"),
    )
    .addOption(
        new Option("--markdown-description", "Generate `markdownDescription` in addition to `description`.").implies({
            jsDoc: "extended",
        }),
    )
    .addOption(
        new Option(
            "--functions <functions>",

            "How to handle functions. `fail` will throw an error. `comment` will add a comment. `hide` will treat the function like a NeverType or HiddenType.",
        )
            .choices(["fail", "comment", "hide"])
            .default("comment"),
    )
    .option("--minify", "Minify generated schema", false)
    .option("--unstable", "Do not sort properties")
    .option("--strict-tuples", "Do not allow additional items on tuples")
    .option("--no-top-ref", "Do not create a top-level $ref definition")
    .option("--no-type-check", "Skip type checks to improve performance")
    .option("--no-ref-encode", "Do not encode references")
    .option("-o, --out <file>", "Set the output file (default: stdout)")
    .option(
        "--validation-keywords [value]",
        "Provide additional validation keywords to include",
        (value: string, list: string[]) => list.concat(value),
        [],
    )
    .option("--additional-properties", "Allow additional properties for objects with no index signature", false)
    .version(pkg.version)
    .parse(process.argv)
    .opts();

const config: Config = {
    minify: args.minify,
    path: args.path,
    tsconfig:
        typeof args.tsconfig === "string" ? args.tsconfig : findConfigFile(process.cwd(), (f) => tsSys.fileExists(f)),
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
    functions: args.functions,
};

try {
    const schema = createGenerator(config).createSchema(args.type);

    const stringify = config.sortProps ? stableStringify : JSON.stringify;
    // need as string since TS can't figure out that the string | undefined case doesn't happen
    const schemaString = (config.minify ? stringify(schema) : stringify(schema, null, 2)) as string;

    if (args.out) {
        // write to file
        const outPath = dirname(args.out);
        mkdirSync(outPath, { recursive: true });
        writeFileSync(args.out, schemaString);
    } else {
        // write to stdout
        console.log(`${schemaString}\n`);
    }
} catch (error) {
    if (error instanceof BaseError) {
        console.error(error.format());

        if (error.cause) {
            console.error(error.cause);
        }

        // Maybe we are being imported by another script
        process.exitCode = 1;
    } else {
        throw error;
    }
}
