import * as commander from "commander";
import * as stringify from "json-stable-stringify";
import { createGenerator } from "./factory/generator";
import { Config, DEFAULT_CONFIG, PartialConfig } from "./src/Config";
import { BaseError } from "./src/Error/BaseError";
import { Schema } from "./src/Schema/Schema";
import { formatError } from "./src/Utils/formatError";

const args = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .option(
        "-e, --expose <expose>",
        "Type exposing",
        /^(all|none|export)$/,
        "export",
    )
    .option(
        "-r, --no-top-ref",
        "Do not create a top-level $ref definition",
    )
    .option(
        "-j, --jsDoc <extended>",
        "Read JsDoc annotations",
        /^(extended|none|basic)$/,
        "extended",
    )
    .option(
        "-u, --unstable",
        "Do not sort properties",
    )
    .option(
        "-s, --strictTuples",
        "Do not allow additional items on tuples",
    )
    .parse(process.argv);

const config: Config = {
    ...DEFAULT_CONFIG,
    path: args.path,
    type: args.type,
    expose: args.expose,
    topRef: args.topRef,
    jsDoc: args.jsDoc,
    sortProps: !args.unstable,
    typeFile: args.typeFile,
    strictTuples: args.strictTuples,
};

try {
    const schema = createGenerator(config).createSchema(args.type);
    process.stdout.write(config.sortProps ?
        stringify(schema, {space: 2}) :
        JSON.stringify(schema, null, 2));
} catch (error) {
    if (error instanceof BaseError) {
        process.stderr.write(formatError(error));
        process.exit(1);
    } else {
        throw error;
    }
}
