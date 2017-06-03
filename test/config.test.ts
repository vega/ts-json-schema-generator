import * as Ajv from "ajv";
import * as ts from "typescript";

import { assert } from "chai";
import { readFileSync } from "fs";
import { resolve } from "path";

import { createProgram } from "../factory/program";
import { createParser } from "../factory/parser";
import { createFormatter } from "../factory/formatter";

import { Config, PartialConfig, DEFAULT_CONFIG } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator: Ajv.Ajv = new Ajv();
const metaSchema: object = require("ajv/lib/refs/json-schema-draft-04.json");
validator.addMetaSchema(metaSchema, "http://json-schema.org/draft-04/schema#");

const basePath: string = "test/config";

function assertSchema(name: string, partialConfig: PartialConfig & {type: string}): void {
    it(name, () => {
        const config: Config = {
            ... DEFAULT_CONFIG,
            ...partialConfig,
            path: resolve(`${basePath}/${name}/*.ts`),
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(generator.createSchema(config.type)));

        assert.isObject(actual);
        assert.deepEqual(actual, expected);

        validator.validateSchema(actual);
        assert.equal(validator.errors, null);
    });
}

describe("config", () => {
    assertSchema("expose-all-topref-true", {type: "MyObject", expose: "all", topRef: true, jsDoc: "none"});
    assertSchema("expose-all-topref-false", {type: "MyObject", expose: "all", topRef: false, jsDoc: "none"});

    assertSchema("expose-none-topref-true", {type: "MyObject", expose: "none", topRef: true, jsDoc: "none"});
    assertSchema("expose-none-topref-false", {type: "MyObject", expose: "none", topRef: false, jsDoc: "none"});

    assertSchema("expose-export-topref-true", {type: "MyObject", expose:  "export", topRef: true, jsDoc: "none"});
    assertSchema("expose-export-topref-false", {type: "MyObject", expose: "export", topRef: false, jsDoc: "none"});

    assertSchema("jsdoc-complex-none", {type: "MyObject", expose: "export", topRef: true, jsDoc: "none"});
    assertSchema("jsdoc-complex-default", {type: "MyObject", expose: "export", topRef: true, jsDoc: "default"});
    assertSchema("jsdoc-complex-extended", {type: "MyObject", expose: "export", topRef: true, jsDoc: "extended"});
    assertSchema("jsdoc-description-only", {type: "MyObject", expose: "export", topRef: true, jsDoc: "extended"});
});
