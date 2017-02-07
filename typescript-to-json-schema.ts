import * as ts from "typescript";
import * as path from "path";
import * as commander from "commander";

import { createGenerator } from "./factory/generator";

import { Config } from "./src/Config";
import { Schema } from "./src/Schema/Schema";
import { DiagnosticError } from "./src/Error/DiagnosticError";

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
    .parse(process.argv);
const config: Config = {
    path: undefined,
    type: undefined,

    expose: "export",
    topRef: true,

    ...args,
};

try {
    const schema: Schema = createGenerator(config).createSchema(args.type);
    process.stdout.write(JSON.stringify(schema, null, 2));
} catch (error) {
    if (error instanceof DiagnosticError) {
        const errorMessage: string = ts.formatDiagnostics(error.getDiagnostics(), {
            getCanonicalFileName: (fileName: string) => fileName,
            getCurrentDirectory: () => path.resolve(path.dirname(args.path)),
            getNewLine: () => "\n",
        });
        process.stderr.write(errorMessage);
        process.exit(1);
    }

    throw error;
}
