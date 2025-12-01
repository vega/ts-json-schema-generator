import { execSync } from "child_process";
import path from "path";
import { describe, it } from "node:test";
import assert from "assert";

const SCHEMA_PATH = path.resolve(__dirname, "./schema.ts");

const EXPECTED = {
    $ref: "#/definitions/Schema",
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {
        Schema: {
            additionalProperties: false,
            properties: {
                a: {
                    type: "number",
                },
            },
            type: "object",
        },
    },
};

describe("Tests --minify output", () => {
    it("With minify", () => {
        const stdout = execSync(`npm --silent run run -- -p ${SCHEMA_PATH} --minify`).toString("utf8").trimEnd();

        // Only a newline at the end
        assert.strictEqual(stdout.split("\n").length, 1);

        // There's a newline at the end
        assert.strictEqual(stdout, JSON.stringify(EXPECTED));

        // The same output for both
        assert.deepStrictEqual(JSON.parse(stdout), EXPECTED);
    });

    it("Without minify", () => {
        const stdout = execSync(`npm --silent run run -- -p ${SCHEMA_PATH}`).toString().trimEnd();

        // There's more than one \n (formatting)
        assert(stdout.split("\n").length > 2);

        // There's a newline at the end
        assert.strictEqual(stdout, JSON.stringify(EXPECTED, null, 2));

        // The same output for both
        assert.deepStrictEqual(JSON.parse(stdout), EXPECTED);
    });
});
