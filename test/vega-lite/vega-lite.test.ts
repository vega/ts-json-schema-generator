import assert from "assert";
import fs from "fs";
import { it } from "node:test";
import stringify from "safe-stable-stringify";
import { createGenerator } from "../../factory/generator.js";
import type { CompletedConfig } from "../../src/Config.js";
import { DEFAULT_CONFIG } from "../../src/Config.js";
import path from "path";

it("vega-lite - schema", async () => {
    const config: CompletedConfig = {
        ...DEFAULT_CONFIG,
        path: `node_modules/vega-lite/src/index.ts`,
        type: "TopLevelSpec",
        encodeRefs: false,
        skipTypeCheck: true,
    };

    const generator = createGenerator(config);
    const schema = generator.createSchema(config.type);
    const schemaFile = path.resolve("test", "vega-lite", "schema.json");

    if (process.env.UPDATE_SCHEMA) {
        await fs.promises.writeFile(schemaFile, stringify(schema, null, 2) + "\n", "utf8");
    }

    const vegaLiteSchema = JSON.parse(await fs.promises.readFile(schemaFile, "utf8"));

    assert.deepStrictEqual(schema, vegaLiteSchema);
});
