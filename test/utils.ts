import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, writeFileSync } from "fs";
import stringify from "json-stable-stringify";
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

export function createGenerator(config: Config): SchemaGenerator {
    const program: ts.Program = createProgram(config);
    return new SchemaGenerator(program, createParser(program, config), createFormatter(config), config);
}

export function assertValidSchema(
    relativePath: string,
    type?: string,
    jsDoc: Config["jsDoc"] = "none",
    extraTags?: Config["extraTags"],
    schemaId?: Config["schemaId"]
) {
    return (): void => {
        const config: Config = {
            path: `${basePath}/${relativePath}/*.ts`,
            type,
            jsDoc,
            extraTags,
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        if (schemaId) {
            config.schemaId = schemaId;
        }

        const generator = createGenerator(config);
        const schema = generator.createSchema(type);
        const schemaFile = resolve(`${basePath}/${relativePath}/schema.json`);

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, { space: 2 }) + "\n", "utf8");
        }

        const expected: any = JSON.parse(readFileSync(schemaFile, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

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
