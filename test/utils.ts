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
import { Context } from "../src/NodeParser";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { makeExemplars } from "../src/Utils/makeExemplar";
import { inspect } from "util";
import { BaseType } from "../src/Type/BaseType";

const validator = new Ajv();
addFormats(validator);

const basePath = "test/valid-data";

interface Validator<T> {
    (value: T): boolean | Promise<unknown>;
    //                    ^^^^^^^^^^^^^^^^ *Why* does validateSchema() sometimes return this? Who knows! >.<
}
interface ErrorContainer {
    errors?: { message?: string }[] | null;
}

expect.extend({
    toValidateUsing<T>(
        this: jest.MatcherContext,
        received: T,
        validationFunction: Validator<T>,
        errorContainer?: ErrorContainer
    ) {
        errorContainer ??= validationFunction as ErrorContainer;
        const previousErrors = errorContainer.errors;
        errorContainer.errors = null;
        try {
            const result = validationFunction.call(errorContainer, received);
            const errors = errorContainer.errors;
            const pass = !!result && errors === null;
            const options: jest.MatcherHintOptions = {
                comment: "Schema validation",
                isNot: this.isNot,
                promise: this.promise,
            };
            const hint = () => this.utils.matcherHint("toValidateUsing", undefined, "validator", options) + "\n\n";
            const printReceived = () => "\n\nReceived: " + this.utils.RECEIVED_COLOR(inspect(received));
            return {
                pass,
                message: pass
                    ? () => hint() + "Expected validation to fail, but it did not." + printReceived()
                    : () =>
                          hint() +
                          "Expected validation to succeed, but it did not." +
                          printReceived() +
                          "\n\n" +
                          `Errors: ${this.utils.EXPECTED_COLOR(inspect(errors))}`,
            };
        } finally {
            errorContainer.errors = previousErrors;
        }
    },
});
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R, T> {
            toValidateUsing(validatorMethod: Validator<T>, errorContainer: ErrorContainer): R;
            toValidateUsing(validatorFunction: Validator<T> & ErrorContainer): R;
        }
    }
}

// Expose some of the SchemaGenerator internals for test use
export class TestSchemaGenerator extends SchemaGenerator {
    public readonly program: ts.Program;
    constructor(config: Config) {
        const program: ts.Program = createProgram(config);
        super(program, createParser(program, config), createFormatter(config), config);
    }

    public getParsedType(fullName: string): BaseType {
        const node = this.findNamedNode(fullName);
        const type = this.nodeParser.createType(node, new Context());
        if (!type) {
            throw new Error(`Could not find or parse type ${fullName}`);
        }
        return type;
    }
}

export function assertValidSchema(
    relativePath: string,
    type?: string,
    jsDoc: Config["jsDoc"] = "none",
    extraTags?: Config["extraTags"],
    schemaId?: Config["schemaId"]
): () => void {
    return assertValidSchemaEx(relativePath, type, { jsDoc, extraTags, schemaId });
}

export function assertValidSchemaEx(
    relativePath: string,
    type?: string,
    {
        valid,
        invalid,
        jsDoc = "none",
        extraTags,
        schemaId,
        ...configOptions
    }: Config & {
        valid?: string;
        invalid?: string;
    } = {}
) {
    return (): void => {
        const config: Config = {
            path: `${basePath}/${relativePath}/*.ts`,
            type,
            jsDoc,
            extraTags,
            skipTypeCheck: !!process.env.FAST_TEST,
            ...configOptions,
        };

        if (schemaId) {
            config.schemaId = schemaId;
        }

        const generator = new TestSchemaGenerator(config);
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

        expect(actual).toValidateUsing(localValidator.validateSchema, localValidator);
        const validate = localValidator.compile(actual); // Will find MissingRef errors

        if (valid) {
            const validType = generator.getParsedType(valid);
            const exemplars = makeExemplars(validType);
            for (const ex of exemplars) {
                expect(ex).toValidateUsing(validate);
            }
        }

        if (invalid) {
            const invalidType = generator.getParsedType(invalid);
            const exemplars = makeExemplars(invalidType);
            for (const ex of exemplars) {
                expect(ex).not.toValidateUsing(validate);
            }
        }
    };
}
