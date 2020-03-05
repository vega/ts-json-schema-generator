import * as Ajv from "ajv";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv({
    extendRefs: "fail",
    format: "full",
});

const basePath = "test/valid-data";

export function assertValidSchema(
    relativePath: string,
    type?: string,
    jsDoc: Config["jsDoc"] = "none",
    extraTags?: Config["extraTags"]
) {
    return () => {
        const config: Config = {
            path: resolve(`${basePath}/${relativePath}/*.ts`),
            type,
            expose: "export",
            topRef: true,
            jsDoc,
            extraTags,
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config)
        );

        const schema = generator.createSchema(type);
        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${relativePath}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        // uncomment to write test files
        // writeFileSync(
        //     resolve(`${basePath}/${relativePath}/schema.json`),
        //     JSON.stringify(schema, null, 4) + "\n",
        //     "utf8"
        // );

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();
        validator.compile(actual); // Will find MissingRef errors
    };
}
