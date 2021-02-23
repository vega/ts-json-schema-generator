// An implicit assumption of using vega/ts-json-schema-generator
// is that we need to not add regressions to the vega-lite schemas.
// When added capabilities to ts-json-schema-generator, the vega-lite
// constraint exposes corner cases that one is forced to tackle
// These are however difficult to create tests for, ultimately
// causing the CI to fail a PR for coverage.
// This is meant as a simple test, that will run within the context
// of the CI build, with the hope of preventing such degradation
// of coverage metrics.

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

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(resolve("test/vega-lite/schema.json"), stringify(schema, { space: 2 }) + "\n", "utf8");
        }

        const vegaLiteSchema = JSON.parse(readFileSync(resolve("test/vega-lite/schema.json"), "utf8"));

        const generatedSchema = JSON.parse(stringify(schema));
        expect(generatedSchema).toEqual(vegaLiteSchema);
    });
});
