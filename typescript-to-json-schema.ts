import * as commander from "commander";
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
        "-r, --topRef <topRef>",
        "Create a top-level $ref definition",
        (v: any) => v === "true" || v === "yes" || v === "1",
        true,
    )
    .option(
        "-j, --jsDoc <topRef>",
        "Read JsDoc annotations",
        /^(extended|none|basic)$/,
        "extended",
    )
    .parse(process.argv);

const config: Config = {
    ...DEFAULT_CONFIG,
    ...args,
};

try {
    const schema: Schema = createGenerator(config).createSchema(args.type);
    process.stdout.write(JSON.stringify(schema, null, 2));
} catch (error) {
    if (error instanceof BaseError) {
        process.stderr.write(formatError(error));
        process.exit(1);
    } else {
        throw error;
    }
}
