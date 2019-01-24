import { assert } from "chai";
import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

function assertSchema(name: string, type: string, message: string): void {
    it(name, () => {
        const config: Config = {
            path: resolve(`test/invalid-data/${name}/*.ts`),
            type: type,

            expose: "export",
            topRef: true,
            jsDoc: "none",
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
            config,
        );

        assert.throws(() => generator.createSchema(type), message);
    });
}

describe("invalid-data", () => {
    // TODO: template recursive

    assertSchema("script-empty", "MyType", `No root type "MyType" found`);
    assertSchema("literal-index-type", "MyType", `Unknown node " ["abc", "def"]`);
    assertSchema("literal-array-type", "MyType", `Unknown node " ["abc", "def"]`);
    assertSchema("literal-object-type", "MyType", `Unknown node " {abc: "def"}`);
});
