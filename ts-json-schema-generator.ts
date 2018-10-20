import * as commander from "commander";
import * as stringify from "json-stable-stringify";
import { createGenerator } from "./factory/generator";
import { Config, DEFAULT_CONFIG } from "./src/Config";
import { BaseError } from "./src/Error/BaseError";
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
        "-j, --jsDoc <extended>",
        "Read JsDoc annotations",
        /^(extended|none|basic)$/,
        "extended",
    )
    .option(
        "-r, --no-top-ref",
        "Do not create a top-level $ref definition",
    )
    .option(
        "-u, --unstable",
        "Do not sort properties",
    )
    .option(
        "-s, --strict-tuples",
        "Do not allow additional items on tuples",
    )
    .option(
        "-c, --no-type-check",
        "Skip type checks to improve performance",
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
    strictTuples: args.strictTuples,
    skipTypeCheck: !args.typeCheck,
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
