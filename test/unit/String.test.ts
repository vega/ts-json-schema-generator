import { strip } from ".../src/Utils/String";

describe("strip", () => {
    it("removes quotes", () => {
        expect(strip("'quote'")).toBe("quote");
        expect(strip('"quote"')).toBe("quote");
    });

    it("ignores individual quotes", () => {
        expect(strip("quote'")).toBe("quote'");
        expect(strip('"quote')).toBe('"quote');
    });

    it("returns original", () => {
        expect(strip("original")).toBe("original");
    });
});
