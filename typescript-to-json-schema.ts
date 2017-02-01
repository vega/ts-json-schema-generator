import * as ts from "typescript";
import * as path from "path";
import * as commander from "commander";

import { createGenerator } from "./factory/generator";

import { Schema } from "./src/Schema/Schema";
import { DiagnosticError } from "./src/Error/DiagnosticError";

const args: any = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .parse(process.argv);

try {
    const schema: Schema = createGenerator(args.path).createSchema(args.type);
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
