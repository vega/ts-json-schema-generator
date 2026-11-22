import { deepMerge } from "../../src/Utils/deepMerge.js";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("deepMerge", () => {
    it("recursively merges object properties and required keys without changing the inputs", () => {
        const a = {
            nested: {
                type: "object" as const,
                additionalProperties: false,
                properties: {
                    left: { type: "string" as const },
                    shared: {
                        type: "object" as const,
                        additionalProperties: false,
                        properties: { value: { type: "number" as const, enum: [1, 2] } },
                    },
                },
                required: ["left"],
            },
        };
        const b = {
            nested: {
                type: "object" as const,
                additionalProperties: false,
                properties: {
                    right: { type: "boolean" as const },
                    shared: {
                        type: "object" as const,
                        additionalProperties: false,
                        properties: { value: { type: "number" as const, enum: [2, 3] } },
                        required: ["value"],
                    },
                },
                required: ["shared", "right"],
            },
        };
        const originals = structuredClone([a, b]);
        const expected = {
            nested: {
                type: "object",
                additionalProperties: false,
                properties: {
                    left: { type: "string" },
                    right: { type: "boolean" },
                    shared: {
                        type: "object",
                        additionalProperties: false,
                        properties: { value: { type: "number", const: 2 } },
                        required: ["value"],
                    },
                },
                required: ["left", "right", "shared"],
            },
        };

        assert.deepStrictEqual(deepMerge(a, b), expected);
        assert.deepStrictEqual(deepMerge(b, a), expected);
        assert.deepStrictEqual([a, b], originals);
    });

    it("keeps nested objects open when either side allows additional properties", () => {
        assert.deepStrictEqual(
            deepMerge(
                { nested: { type: "object", additionalProperties: false, properties: { a: {} }, required: ["a"] } },
                { nested: { type: "object", properties: { b: {} }, required: ["b"] } },
            ),
            { nested: { type: "object", properties: { a: {}, b: {} }, required: ["a", "b"] } },
        );
    });

    it("merges booleans with enums", () => {
        assert.deepStrictEqual(deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean" } }), {
            flag: { type: "boolean", const: true },
        });
        assert.deepStrictEqual(
            deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean", enum: [true, false] } }),
            { flag: { type: "boolean", const: true } },
        );
    });

    it("merges booleans with const and enum", () => {
        assert.deepStrictEqual(deepMerge({ flag: { type: "boolean", const: false } }, { flag: { type: "boolean" } }), {
            flag: { type: "boolean", const: false },
        });
        assert.deepStrictEqual(
            deepMerge({ flag: { type: "boolean", const: false } }, { flag: { type: "boolean", enum: [true, false] } }),
            { flag: { type: "boolean", const: false } },
        );
    });

    it("merges numbers with enums", () => {
        assert.deepStrictEqual(deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number" } }), {
            flag: { type: "number", enum: [1, 2] },
        });
        assert.deepStrictEqual(
            deepMerge({ flag: { type: "number", enum: [1, 2, 3] } }, { flag: { type: "number", enum: [1, 3] } }),
            {
                flag: { type: "number", enum: [1, 3] },
            },
        );
        assert.deepStrictEqual(
            deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number", enum: [1, 3] } }),
            {
                flag: { type: "number", const: 1 },
            },
        );
    });

    it("merges numbers with const and enum", () => {
        assert.deepStrictEqual(deepMerge({ flag: { type: "number", const: 1 } }, { flag: { type: "number" } }), {
            flag: { type: "number", const: 1 },
        });
        assert.deepStrictEqual(
            deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number", const: 2 } }),
            {
                flag: { type: "number", const: 2 },
            },
        );
    });
});
