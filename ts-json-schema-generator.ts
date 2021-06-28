import { Command, Option } from "commander";
import { writeFile } from "fs";
import stringify from "json-stable-stringify";
import { createGenerator } from "./factory/generator";
import { Config, DEFAULT_CONFIG } from "./src/Config";
import { BaseError } from "./src/Error/BaseError";
import { formatError } from "./src/Utils/formatError";
import * as pkg from "./package.json";

const args = new Command()
    .option("-p, --path <path>", "Source file path")
    .option("-t, --type <name>", "Type name")
    .option("-i, --id <name>", "$id for generated schema")
    .option("-f, --tsconfig <path>", "Custom tsconfig.json path")
    .addOption(
        new Option("-e, --expose <expose>", "Type exposing").choices(["all", "none", "export"]).default("export")
    )
    .addOption(
        new Option("-j, --jsDoc <extended>", "Read JsDoc annotations")
            .choices(["none", "basic", "extended"])
            .default("extended")
    )
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
        []
    )
    .option(
        "--additional-properties",
        "Allow additional properties for objects with no index signature (default: false)",
        false
    )
    .version(pkg.version)
    .parse(process.argv)
    .opts();

const config: Config = {
    ...DEFAULT_CONFIG,
    path: args.path,
    tsconfig: args.tsconfig,
    type: args.type,
    schemaId: args.id,
    expose: args.expose,
    topRef: args.topRef,
    jsDoc: args.jsDoc,
    sortProps: !args.unstable,
    strictTuples: args.strictTuples,
    skipTypeCheck: !args.typeCheck,
    encodeRefs: args.refEncode,
    extraTags: args.validationKeywords,
    additionalProperties: args.additionalProperties,
};

try {
    const schema = createGenerator(config).createSchema(args.type);
    const schemaString = config.sortProps ? stringify(schema, { space: 2 }) : JSON.stringify(schema, null, 2);

    if (args.out) {
        // write to file
        writeFile(args.out, schemaString, (err) => {
            if (err) throw err;
        });
    } else {
        // write to stdout
        process.stdout.write(`${schemaString}\n`);
    }
} catch (error) {
    if (error instanceof BaseError) {
        process.stderr.write(formatError(error));
        process.exit(1);
    } else {
        throw error;
    }
}
