import { HiddenType } from "../../../src/Type/HiddenType";
import { NeverType } from "../../../src/Type/NeverType";

describe("HiddenType", () => {
    it("creates a HiddenType", () => {
        const hidden = new HiddenType();
        expect(hidden instanceof NeverType).toBe(true);
        expect(hidden.getId()).toBe("hidden");
    });
});
