import { describe, it, expect } from "vitest";
import { intersectionOfArrays } from "../../src/Utils/intersectionOfArrays.js";

describe("intersectionOfArrays", () => {
    it("returns members of a in b", () => {
        expect(intersectionOfArrays([1, 2, 3, 4], [1, 2])).toEqual([1, 2]);
        expect(intersectionOfArrays([{ foo: "bar" }], [{ foo: "bar" }])).toEqual([{ foo: "bar" }]);
        expect(intersectionOfArrays([1, 2, 3, 4], [5, 2, 1, 9])).toEqual([2, 1]);
        expect(intersectionOfArrays([1, "2", 3, "4"], ["5", 2, 1, 9])).toEqual([1]);
    });
});
