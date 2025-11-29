import assert from "node:assert";
import { makeNullable } from "../../src/TypeFormatter/AnnotatedTypeFormatter.js";
import { describe, it } from "node:test";

describe("makeNullable", () => {
    it("makes number nullable", () => {
        const n = makeNullable({ type: "number" });
        assert.deepStrictEqual(n, {
            type: ["number", "null"],
        });
    });

    it("makes enum nullable", () => {
        const n = makeNullable({
            enum: ["foo"],
            type: "string",
        });
        assert.deepStrictEqual(n, {
            enum: ["foo", null],
            type: ["string", "null"],
        });
    });

    it("makes anyOf nullable", () => {
        const n = makeNullable({
            anyOf: [{ type: "number" }, { type: "string" }],
        });
        assert.deepStrictEqual(n, {
            anyOf: [{ type: "number" }, { type: "string" }, { type: "null" }],
        });
    });
});
