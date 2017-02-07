import * as ts from "typescript";

import { assert } from "chai";
import { resolve } from "path";

import { createProgram } from "../factory/program";
import { createParser } from "../factory/parser";
import { createFormatter } from "../factory/formatter";

import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const basePath: string = "test/invalid-data";

function assertSchema(name: string, type: string): void {
    it(name, () => {
        const config: Config = {
            path: resolve(`${basePath}/${name}/*.ts`),
            type: type,

            expose: "export",
            topRef: true,
            jsDoc: false,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        assert.throws(() => generator.createSchema(type));
    });
}

describe("invalid-data", () => {
    // TODO: template recursive

    assertSchema("type-typeof", "MyType");
    assertSchema("type-intersection", "MyType");

    assertSchema("script-empty", "MyType");
});
