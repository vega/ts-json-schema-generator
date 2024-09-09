import { describe, it, expect } from "vitest";
import { makeNullable } from "../../src/TypeFormatter/AnnotatedTypeFormatter.js";

describe("makeNullable", () => {
    it("makes number nullable", () => {
        const n = makeNullable({ type: "number" });
        expect(n).toEqual({
            type: ["number", "null"],
        });
    });

    it("makes enum nullable", () => {
        const n = makeNullable({
            enum: ["foo"],
            type: "string",
        });
        expect(n).toEqual({
            enum: ["foo", null],
            type: ["string", "null"],
        });
    });

    it("makes anyOf nullable", () => {
        const n = makeNullable({
            anyOf: [{ type: "number" }, { type: "string" }],
        });
        expect(n).toEqual({
            anyOf: [{ type: "number" }, { type: "string" }, { type: "null" }],
        });
    });
});
