import { deepMerge } from "../../src/Utils/deepMerge.js";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("deepMerge", () => {
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
