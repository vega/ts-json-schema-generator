import { deepMerge } from "../../src/Utils/deepMerge.js";

describe("deepMerge", () => {
    it("merges booleans with enums", () => {
        expect(deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean" } })).toEqual({
            flag: { type: "boolean", const: true },
        });
        expect(
            deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean", enum: [true, false] } }),
        ).toEqual({ flag: { type: "boolean", const: true } });
    });

    it("merges booleans with const and enum", () => {
        expect(deepMerge({ flag: { type: "boolean", const: false } }, { flag: { type: "boolean" } })).toEqual({
            flag: { type: "boolean", const: false },
        });
        expect(
            deepMerge({ flag: { type: "boolean", const: false } }, { flag: { type: "boolean", enum: [true, false] } }),
        ).toEqual({ flag: { type: "boolean", const: false } });
    });

    it("merges numbers with enums", () => {
        expect(deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number" } })).toEqual({
            flag: { type: "number", enum: [1, 2] },
        });
        expect(
            deepMerge({ flag: { type: "number", enum: [1, 2, 3] } }, { flag: { type: "number", enum: [1, 3] } }),
        ).toEqual({
            flag: { type: "number", enum: [1, 3] },
        });
        expect(
            deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number", enum: [1, 3] } }),
        ).toEqual({
            flag: { type: "number", const: 1 },
        });
    });

    it("merges numbers with const and enum", () => {
        expect(deepMerge({ flag: { type: "number", const: 1 } }, { flag: { type: "number" } })).toEqual({
            flag: { type: "number", const: 1 },
        });
        expect(deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number", const: 2 } })).toEqual({
            flag: { type: "number", const: 2 },
        });
    });
});
