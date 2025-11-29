import { describe, it, type TestFn } from "node:test";
import { resolve } from "path";
import type ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import type { CompletedConfig } from "../src/Config.js";
import { DEFAULT_CONFIG } from "../src/Config.js";
import { BaseError } from "../src/Error/BaseError.js";
import { SchemaGenerator } from "../src/SchemaGenerator.js";
import assert from "assert";
import { t } from "try";

function assertSchema(name: string, type: string, message: string): TestFn {
    return async () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: resolve("test", "invalid-data", name, `*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "basic",
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        const program: ts.Program = createProgram(config);

        const [ok, error, generator] = t(
            () => new SchemaGenerator(program, createParser(program, config), createFormatter(config)),
        );

        if (!ok) {
            if (error instanceof BaseError) {
                console.error(error.format(true));
            }

            throw error;
        }

        assert.throws(() => generator.createSchema(type), { message });
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
