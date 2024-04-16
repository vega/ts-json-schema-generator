import Ajv, { Options as AjvOptions } from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import stringify from "safe-stable-stringify";
import ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { CompletedConfig, Config, DEFAULT_CONFIG } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv({ discriminator: true });
addFormats(validator);

const basePath = "test/valid-data";

export function createGenerator(config: CompletedConfig): SchemaGenerator {
    const program: ts.Program = createProgram(config);
    return new SchemaGenerator(program, createParser(program, config), createFormatter(config), config);
}

export function assertValidSchema(
    relativePath: string,
    type?: Config["type"],
    config_?: Omit<Config, "type">,
    options?: {
        /**
         * Array of sample data
         * that should
         * successfully validate.
         */
        validSamples?: any[];
        /**
         * Array of sample data
         * that should
         * fail to validate.
         */
        invalidSamples?: any[];
        /**
         * Options to pass to Ajv
         * when creating the Ajv
         * instance.
         *
         * @default {strict:false}
         */
        ajvOptions?: AjvOptions;
        mainTsOnly?: boolean;
    }
) {
    return (): void => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: `${basePath}/${relativePath}/${options?.mainTsOnly ? "main" : "*"}.ts`,
            skipTypeCheck: !!process.env.FAST_TEST,
            type,
            ...config_,
        };

        const generator = createGenerator(config);
        const schema = generator.createSchema(config.type);
        const schemaFile = resolve(`${basePath}/${relativePath}/schema.json`);

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
        }

        const expected: any = JSON.parse(readFileSync(schemaFile, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        let localValidator = validator;
        if (config.extraTags) {
            localValidator = new Ajv(options?.ajvOptions || { strict: false });
            addFormats(localValidator);
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        localValidator.validateSchema(actual);
        expect(localValidator.errors).toBeNull();

        // Compile in all cases to detect MissingRef errors
        const validate = localValidator.compile(actual);

        // Use the compiled validator if there
        // are any samples.
        if (options?.invalidSamples) {
            for (const sample of options.invalidSamples) {
                const isValid = validate(sample);
                if (isValid) {
                    console.log("Unexpectedly Valid:", sample);
                }
                expect(isValid).toBe(false);
            }
        }
        if (options?.validSamples) {
            for (const sample of options.validSamples) {
                const isValid = validate(sample);
                if (!isValid) {
                    console.log("Unexpectedly Invalid:", sample);

                    console.log("AJV Errors:", validate.errors);
                }
                expect(isValid).toBe(true);
            }
        }
    };
}
