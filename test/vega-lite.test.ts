import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Config } from "../src/Config";
import { createGenerator } from "./utils";
import stringify from "json-stable-stringify";

describe("vega-lite", () => {
    it("schema", () => {
        const type = "TopLevelSpec";
        const config: Config = {
            path: `node_modules/vega-lite/src/index.ts`,
            type,
            encodeRefs: false,
            skipTypeCheck: true,
        };

        const generator = createGenerator(config);
        const schema = generator.createSchema(type);
        const schemaFile = resolve("test/vega-lite/schema.json");

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, { space: 2 }) + "\n", "utf8");
        }

        const vegaLiteSchema = JSON.parse(readFileSync(schemaFile, "utf8"));

        expect(schema).toEqual(vegaLiteSchema);
    });
});
