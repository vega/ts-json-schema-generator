import type { Options as AjvOptions } from "ajv";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { TestFn } from "node:test";
import stringify from "safe-stable-stringify";
import { t } from "try";
import type ts from "typescript";
import type { FormatterAugmentor } from "../factory/formatter";
import { createFormatter } from "../factory/formatter";
import { createGenerator } from "../factory/generator.js";
import type { ParserAugmentor } from "../factory/parser";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import type { CompletedConfig, Config } from "../src/Config.js";
import { DEFAULT_CONFIG } from "../src/Config.js";
import { BaseError } from "../src/Error/BaseError.js";
import { SchemaGenerator } from "../src/SchemaGenerator.js";

const validator = new Ajv({ discriminator: true });
addFormats(validator);

const baseValidPath = "test/valid-data";
const baseConfigPath = "test/config";
const baseInvalidPath = "test/invalid-data";

export function assertConfigSchema(
    name: string,
    userConfig: Config & { type: string | string[] },
    tsconfig?: boolean,
    formatterAugmentor?: FormatterAugmentor,
    parserAugmentor?: ParserAugmentor,
): TestFn {
    return async () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            ...userConfig,
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        if (tsconfig) {
            config.tsconfig = path.resolve(baseConfigPath, name, "tsconfig.json");
        } else {
            config.path = path.resolve(baseConfigPath, name, "*.ts");
        }

        const [ok, error, generator] = t(() => {
            const program: ts.Program = createProgram(config);
            return new SchemaGenerator(
                program,
                createParser(program, config, parserAugmentor),
                createFormatter(config, formatterAugmentor),
                config,
            );
        });

        if (!ok) {
            if (error instanceof BaseError) {
                console.error(error.format(true));
            }

            throw error;
        }

        const schema = generator.createSchema(config.type);
        const schemaFile = path.resolve(baseConfigPath, name, "schema.json");

        if (process.env.UPDATE_SCHEMA) {
            await fs.promises.writeFile(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
        }

        const expected: any = JSON.parse(await fs.promises.readFile(schemaFile, "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        assert.equal(typeof actual, "object");
        assert.deepStrictEqual(actual, expected);

        const keywords: string[] = [];
        if (config.markdownDescription) keywords.push("markdownDescription");
        if (config.fullDescription) keywords.push("fullDescription");

        const localValidator = new Ajv({
            // skip full check if we are not encoding refs
            validateFormats: config.encodeRefs === false ? undefined : true,
            keywords: keywords.length ? keywords : undefined,
        });

        addFormats(localValidator);

        localValidator.validateSchema(actual);
        assert.equal(localValidator.errors, null);

        localValidator.compile(actual); // Will find MissingRef errors
    };
}

export function assertInvalidSchema(name: string, type: string | string[], message: string) {
    return () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: path.resolve(baseInvalidPath, name, `*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "basic",
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        const [ok, error, generator] = t(() => {
            const program = createProgram(config);
            return new SchemaGenerator(program, createParser(program, config), createFormatter(config));
        });

        if (!ok) {
            if (error instanceof BaseError) {
                console.error(error.format(true));
            }

            throw error;
        }

        assert.throws(() => generator.createSchema(type), { message });
    };
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
    },
): TestFn {
    return async () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: path.resolve(baseValidPath, relativePath, `${options?.mainTsOnly ? "main" : "*"}.ts`),
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
        const schemaFile = path.resolve(baseValidPath, relativePath, "schema.json");

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
