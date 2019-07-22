import { deepMerge } from "../../src/Utils/deepMerge";

describe("deepMerge", () => {
    it("returns b if non mergable", () => {
        const values = ["string", 1, null, false, true, undefined, BigInt(5), Symbol("symbol"), () => {}];
        for (const value of values) {
            expect(deepMerge(value, value)).toBe(value);
        }

        // Check isArray vs typeof 'object'
        expect(deepMerge([1, 2, 3], { foo: "bar" })).toEqual({ foo: "bar" });
        expect(deepMerge({ foo: "bar" }, [2, 3, 4])).toEqual([2, 3, 4]);
    });

    it("concatenates arrays", () => {
        expect(deepMerge([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
        expect(deepMerge([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3, 1, 2, 3]);
        expect(deepMerge([1, [2], 3], [1, [2], 3])).toEqual([1, [2], 3, 1, [2], 3]);
        expect(deepMerge([1, { foo: "bar" }, 3], [1, { bar: "foo" }, 3])).toEqual([
            1,
            { foo: "bar" },
            3,
            1,
            { bar: "foo" },
            3,
        ]);
    });

    it("merges objects", () => {
        expect(deepMerge({ foo: "bar" }, { bar: "foo" })).toEqual({ foo: "bar", bar: "foo" });
        expect(deepMerge({ foo: "baz" }, { foo: "bar" })).toEqual({ foo: "bar" });
        expect(deepMerge({ flag: { type: "boolean", enums: [true] } }, { flag: { type: "boolean" } })).toEqual({
            flag: { type: "boolean", enums: [true] },
        });
        expect(
            deepMerge({ flag: { type: "boolean", enums: [true] } }, { flag: { type: "boolean", enums: [false] } })
        ).toEqual({ flag: { type: "boolean", enums: [true, false] } });
    });
});
