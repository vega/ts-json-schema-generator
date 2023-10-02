import { Command, Option } from "commander";
import stableStringify from "safe-stable-stringify";
import { isExternalModule } from "typescript";
import { createGenerator } from "./factory/generator";
import { Config, DEFAULT_CONFIG } from "./src/Config";
import { BaseError } from "./src/Error/BaseError";
import { TypeMap } from "./src/SchemaGenerator";
import { formatError } from "./src/Utils/formatError";
import * as pkg from "./package.json";
import { dirname, relative } from "path";
import { mkdirSync, writeFileSync } from "fs";

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
    .option("--minify", "Minify generated schema", false)
    .option("--unstable", "Do not sort properties")
    .option("--strict-tuples", "Do not allow additional items on tuples")
    .option("--no-top-ref", "Do not create a top-level $ref definition")
    .option("--no-type-check", "Skip type checks to improve performance")
    .option("--no-ref-encode", "Do not encode references")
    .option("-o, --out <file>", "Set the output file (default: stdout)")
    .option("-m, --typemap <file>", "Generate a TypeScript type map file")
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
    minify: args.minify,
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
    const typeMaps: TypeMap[] = [];
    const schema = createGenerator(config).createSchema(args.type, typeMaps);

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
        process.stdout.write(`${schemaString}\n`);
    }

    if (args.typemap) {
        writeTypeMapFile(typeMaps, args.typemap);
    }
} catch (error) {
    if (error instanceof BaseError) {
        process.stderr.write(formatError(error));
        process.exit(1);
    } else {
        throw error;
    }
}

function writeTypeMapFile(typeMaps: TypeMap[], typeMapeFile: string) {
    const typeMapDir = dirname(typeMapeFile);
    const typesSeen = new Set<string>();
    let code = "";

    typeMaps.forEach((typeMap) => {
        const fileName = relative(typeMapDir, typeMap.sourceFile.fileName);
        const imported = typeMap.exports.filter((type) => !typesSeen.has(type));
        imported.forEach((type) => typesSeen.add(type));

        if (isExternalModule(typeMap.sourceFile)) {
            code += `import type { ${imported.join(", ")} } from "./${fileName}";\n`;
        } else {
            code += `import "./${fileName}";\n`;
        }
    });

    code += "\nexport default interface Definitions {\n";

    typeMaps.forEach((typeMap) =>
        typeMap.typeNames.forEach((typeName) => {
            code += `    [\`${typeName}\`]: ${typeName};\n`;
        })
    );

    code += `}\n`;

    mkdirSync(typeMapDir, { recursive: true });
    writeFileSync(typeMapeFile, code);
}
