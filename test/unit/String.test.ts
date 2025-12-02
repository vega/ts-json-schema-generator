import assert from "node:assert";
import { strip } from "../../src/Utils/String";
import { describe, it } from "node:test";

describe("strip", () => {
    it("removes quotes", () => {
        assert.strictEqual(strip("'quote'"), "quote");
        assert.strictEqual(strip('"quote"'), "quote");
    });

    it("ignores individual quotes", () => {
        assert.strictEqual(strip("quote'"), "quote'");
        assert.strictEqual(strip('"quote'), '"quote');
    });

    it("returns original", () => {
        assert.strictEqual(strip("original"), "original");
    });
});
