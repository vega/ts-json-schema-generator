import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { createProgram } from "../../factory/program";
import { DEFAULT_CONFIG } from "../../src/Config.js";

describe("createProgram", () => {
    it("resolves a relative tsconfig path for correct @types resolution in monorepos", () => {
        const tsconfig = "test/config/tsconfig-support/tsconfig.json";

        // Preconditions: the tsconfig path must be relative and @types must not
        // exist in the cwd, so that resolution depends on walking up directories
        assert.ok(!path.isAbsolute(tsconfig), "tsconfig path must be relative");
        assert.ok(
            !fs.existsSync(path.join(path.dirname(tsconfig), "node_modules", "@types")),
            "test fixture must not have local @types",
        );

        // Precondition: the tsconfig must explicitly list types, which triggers
        // the bug when the config file path is not resolved to absolute
        const raw = JSON.parse(fs.readFileSync(tsconfig, "utf8"));
        assert.ok(raw.compilerOptions?.types?.length > 0, "tsconfig must explicitly list types");

        const program = createProgram({
            ...DEFAULT_CONFIG,
            type: "MyObject",
            tsconfig,
            skipTypeCheck: false,
        });

        assert.ok(program);
    });
});
