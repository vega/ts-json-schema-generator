import { execSync } from "child_process";
import path from "path";

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
        const stdout = execSync(`npx ts-json-schema-generator -p ${SCHEMA_PATH} --minify`).toString().trimEnd();

        // Only a newline at the end
        expect(stdout.split("\n").length).toBe(1);

        // There's a newline at the end
        expect(stdout).toEqual(JSON.stringify(EXPECTED));

        // The same output for both
        expect(JSON.parse(stdout)).toStrictEqual(EXPECTED);
    });

    it("Without minify", () => {
        const stdout = execSync(`npx ts-json-schema-generator -p ${SCHEMA_PATH}`).toString().trimEnd();

        // There's more than one \n (formatting)
        expect(stdout.split("\n").length).toBeGreaterThan(2);

        // There's a newline at the end
        expect(stdout).toEqual(JSON.stringify(EXPECTED, null, 2));

        // The same output for both
        expect(JSON.parse(stdout)).toStrictEqual(EXPECTED);
    });
});
