import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Config } from "../src/Config";
import { TestSchemaGenerator } from "./utils";
import stringify from "json-stable-stringify";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("vega-lite", () => {
    it("schema", () => {
        const type = "TopLevelSpec";
        const config: Config = {
            path: `node_modules/vega-lite/src/index.ts`,
            type,
            encodeRefs: false,
            skipTypeCheck: true,
        };

        const generator = new TestSchemaGenerator(config);
        const schema = generator.createSchema(type);
        const schemaFile = resolve("test/vega-lite/schema.json");

        const validator = new Ajv({ strict: false });
        addFormats(validator);

        validator.validateSchema(schema);
        expect(validator.errors).toBeNull();
        validator.compile(schema); // Will find MissingRef errors

        if (process.env.UPDATE_SCHEMA) {
            writeFileSync(schemaFile, stringify(schema, { space: 2 }) + "\n", "utf8");
        }

        const vegaLiteSchema = JSON.parse(readFileSync(schemaFile, "utf8"));

        expect(schema).toEqual(vegaLiteSchema);
    });
});
