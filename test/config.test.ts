import * as Ajv from "ajv";
import * as ts from "typescript";

import { assert } from "chai";
import { readFileSync } from "fs";
import { resolve } from "path";

import { createProgram } from "../factory/program";
import { createParser } from "../factory/parser";
import { createFormatter } from "../factory/formatter";

import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator: Ajv.Ajv = new Ajv();
const basePath: string = "test/config";

function assertSchema(name: string, type: string, expose: "all" | "none" | "export", topRef: boolean): void {
    it(name, () => {
        const config: Config = {
            path: resolve(`${basePath}/${name}/*.ts`),
            type: type,

            expose: expose,
            topRef: topRef,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(generator.createSchema(type)));

        assert.isObject(actual);
        assert.deepEqual(actual, expected);

        validator.validateSchema(actual);
        assert.equal(validator.errors, null);
    });
}

describe("config", () => {
    assertSchema("expose-all-topref-true", "MyObject", "all", true);
    assertSchema("expose-all-topref-false", "MyObject", "all", false);

    assertSchema("expose-none-topref-true", "MyObject", "none", true);
    assertSchema("expose-none-topref-false", "MyObject", "none", false);

    assertSchema("expose-export-topref-true", "MyObject", "export", true);
    assertSchema("expose-export-topref-false", "MyObject", "export", false);
});
