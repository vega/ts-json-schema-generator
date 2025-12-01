import assert from "assert";
import { HiddenType } from "../../../src/Type/HiddenType.js";
import { NeverType } from "../../../src/Type/NeverType.js";
import { describe, it } from "node:test";

describe("HiddenType", () => {
    it("creates a HiddenType", () => {
        const hidden = new HiddenType();
        assert.strictEqual(hidden instanceof NeverType, true);
        assert.strictEqual(hidden.getId(), "hidden");
    });
});
