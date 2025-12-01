import type { Options as AjvOptions } from "ajv";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "node:fs";
import path from "node:path";
import type { TestFn } from "node:test";
import stringify from "safe-stable-stringify";
import { createGenerator } from "../factory/generator.js";
import type { CompletedConfig, Config } from "../src/Config.js";
import { DEFAULT_CONFIG } from "../src/Config.js";
import { t } from "try";
import { BaseError } from "../src/Error/BaseError.js";
import assert from "node:assert";

const validator = new Ajv({ discriminator: true });
addFormats(validator);

const basePath = "test/valid-data";

export interface ValidSchemaOptions {
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

export function assertValidSchema(
    relativePath: string,
    type?: Config["type"],
    config_?: Omit<Config, "type">,
    options?: ValidSchemaOptions,
): TestFn {
    return async () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: path.resolve(basePath, relativePath, `${options?.mainTsOnly ? "main" : "*"}.ts`),
            skipTypeCheck: !!process.env.FAST_TEST,
            type,
            ...config_,
        };

        const [ok, error, generator] = t(() => createGenerator(config));

        if (!ok) {
            if (error instanceof BaseError) {
                console.error(error.format(true));
            }

            throw error;
        }

        const schema = generator.createSchema(config.type);
        const schemaFile = path.resolve(basePath, relativePath, "schema.json");

        if (process.env.UPDATE_SCHEMA) {
            await fs.promises.writeFile(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
        }

        const expected: any = JSON.parse(await fs.promises.readFile(schemaFile, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        assert.equal(typeof actual, "object");
        assert.deepStrictEqual(actual, expected);

        let localValidator = validator;
        if (config.extraTags) {
            localValidator = new Ajv(options?.ajvOptions || { strict: false });
            addFormats(localValidator);
        }

        localValidator.validateSchema(actual);
        assert.equal(localValidator.errors, null);

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

                assert.equal(isValid, false);
            }
        }

        if (options?.validSamples) {
            for (const sample of options.validSamples) {
                const isValid = validate(sample);

                if (!isValid) {
                    console.log("Unexpectedly Invalid:", sample);
                    console.log("AJV Errors:", validate.errors);
                }

                assert.equal(isValid, true);
            }
        }
    };
}
