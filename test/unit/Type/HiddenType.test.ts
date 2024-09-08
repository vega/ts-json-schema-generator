import { describe, it, expect } from "vitest";
import { HiddenType } from "../../../src/Type/HiddenType.js";
import { NeverType } from "../../../src/Type/NeverType.js";

describe("HiddenType", () => {
    it("creates a HiddenType", () => {
        const hidden = new HiddenType();
        expect(hidden instanceof NeverType).toBe(true);
        expect(hidden.getId()).toBe("hidden");
    });
});
