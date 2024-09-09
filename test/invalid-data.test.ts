import { describe, it, expect } from "vitest";
import { resolve } from "path";
import ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { CompletedConfig, DEFAULT_CONFIG } from "../src/Config.js";
import { SchemaGenerator } from "../src/SchemaGenerator.js";

function assertSchema(name: string, type: string, message: string) {
    return () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: resolve(`test/invalid-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "basic",
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        expect(() => generator.createSchema(type)).toThrow(message);
    };
}

describe("invalid-data", () => {
    // TODO: template recursive

    it("script-empty", assertSchema("script-empty", "MyType", `No root type "MyType" found`));
    it("duplicates", assertSchema("duplicates", "MyType", `Type "A" has multiple definitions.`));
    it(
        "missing-discriminator",
        assertSchema("missing-discriminator", "MyType", 'Cannot find discriminator keyword "type" in type B.'),
    );
    it(
        "non-union-discriminator",
        assertSchema(
            "non-union-discriminator",
            "MyType",
            "Cannot assign discriminator tag to type: interface-2103469249-0-76-2103469249-0-77. This tag can only be assigned to union types.",
        ),
    );
    it(
        "duplicate-discriminator",
        assertSchema("duplicate-discriminator", "MyType", 'Duplicate discriminator values: A in type "(A|B)".'),
    );
});
