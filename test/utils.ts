import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv();
addFormats(validator);

const basePath = "test/valid-data";

export function assertValidSchema(
    relativePath: string,
    type?: string,
    jsDoc: Config["jsDoc"] = "none",
    extraTags?: Config["extraTags"],
    schemaId?: Config["schemaId"]
) {
    return (): void => {
        const config: Config = {
            path: resolve(`${basePath}/${relativePath}/*.ts`),
            type,
            jsDoc,
            extraTags,
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        if (schemaId) {
            config.schemaId = schemaId;
        }

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
            config
        );

        const schema = generator.createSchema(type);
        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${relativePath}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        // uncomment to write test files
        writeFileSync(
            resolve(`${basePath}/${relativePath}/schema.json`),
            JSON.stringify(schema, null, 4) + "\n",
            "utf8"
        );

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        let localValidator = validator;
        if (extraTags) {
            localValidator = new Ajv({ strict: false });
            addFormats(localValidator);
        }

        localValidator.validateSchema(actual);
        expect(localValidator.errors).toBeNull();
        localValidator.compile(actual); // Will find MissingRef errors
    };
}
