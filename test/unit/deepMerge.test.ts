import { deepMerge } from "../../src/Utils/deepMerge";

describe("deepMerge", () => {
    it("merges booleans with enums", () => {
        expect(deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean" } })).toEqual({
            flag: { type: "boolean", enum: [true] },
        });
        expect(
            deepMerge({ flag: { type: "boolean", enum: [true] } }, { flag: { type: "boolean", enum: [true, false] } })
        ).toEqual({ flag: { type: "boolean", enum: [true] } });
    });

    it("merges numbers with enums", () => {
        expect(deepMerge({ flag: { type: "number", enum: [1] } }, { flag: { type: "number" } })).toEqual({
            flag: { type: "number", enum: [1] },
        });
        expect(
            deepMerge({ flag: { type: "number", enum: [1, 2] } }, { flag: { type: "number", enum: [1, 3] } })
        ).toEqual({
            flag: { type: "number", enum: [1] },
        });
    });
});
