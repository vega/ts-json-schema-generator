import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { CompletedConfig, DEFAULT_CONFIG } from "../src/Config.js";
import { createGenerator } from "./utils";
import stringify from "safe-stable-stringify";

describe("vega-lite", () => {
    it("schema", () => {
        const config: CompletedConfig = {
            ...DEFAULT_CONFIG,
            path: `node_modules/vega-lite/src/index.ts`,
            type: "TopLevelSpec",
            encodeRefs: false,
            skipTypeCheck: true,
        };

        const generator = createGenerator(config);
        const schema = generator.createSchema(config.type);
        const schemaFile = resolve("test/vega-lite/schema.json");

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
        }

        const vegaLiteSchema = JSON.parse(readFileSync(schemaFile, "utf8"));

        expect(schema).toEqual(vegaLiteSchema);
    });
});
