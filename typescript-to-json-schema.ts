import * as commander from "commander";
import * as stringify from "json-stable-stringify";
import { createGenerator } from "./factory/generator";
import { Config, DEFAULT_CONFIG, PartialConfig } from "./src/Config";
import { BaseError } from "./src/Error/BaseError";
import { Schema } from "./src/Schema/Schema";
import { formatError } from "./src/Utils/formatError";

const args: any = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .option(
        "-e, --expose <expose>",
        "Type exposing",
        /^(all|none|export)$/,
        "export",
    )
    .option(
        "-r, --topRef",
        "Create a top-level $ref definition",
        (v: any) => v === "true" || v === "yes" || v === "1",
        true,
    )
    .option(
        "-j, --jsDoc <extended>",
        "Read JsDoc annotations",
        /^(extended|none|basic)$/,
        "extended",
    )
    .option(
        "-s, --sortProps",
        "Sort properties for stable output",
        (v: any) => v === "true" || v === "yes" || v === "1",
        true,
    )
    .parse(process.argv);

const config: Config = {
    ...DEFAULT_CONFIG,
    ...args,
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
