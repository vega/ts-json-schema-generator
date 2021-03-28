import { Definition } from "../../src/Schema/Definition";
import { mergeDefinitions } from "../../src/Utils/mergeDefinitions";

function assertMerges(def1: Definition, def2: Definition, expected?: Definition) {
    return () => {
        const actual = mergeDefinitions(def1, def2);
        if (expected) {
            expect(actual).toEqual(expected);
        } else {
            expect(actual).not.toBeNull();
        }
        const allKeys = Array.from(new Set(Object.keys(def1).concat(Object.keys(def2))));
        if (allKeys.includes("const")) {
            // 'const' keys turn into 'enum' keys
            allKeys.splice(allKeys.indexOf("const"), 1);
            if (!allKeys.includes("enum")) {
                allKeys.push("enum");
            }
        }
        expect(Object.keys(actual).sort()).toEqual(allKeys.sort());
    };
}

function assertDoesNotMerge(def1: Definition, def2: Definition) {
    return () => {
        const actual = mergeDefinitions(def1, def2);
        expect(actual).toBeNull();
    };
}

describe("mergeDefinitions", () => {
    it(
        "merges simple unlike types",
        assertMerges({ type: "string" }, { type: "number" }, { type: ["string", "number"] })
    );
    it("does not merge identical types", assertDoesNotMerge({ type: "number" }, { type: "number" }));
    it(
        "merges complex unlike types",
        assertMerges({ type: "object", additionalProperties: false }, { type: "array", additionalItems: false })
    );
    it(
        "does not merge types that share properties",
        assertDoesNotMerge({ type: "string", description: "a string" }, { type: "number", description: "a number" })
    );
    it("merges consts into an enum", assertMerges({ const: "one" }, { const: "two" }, { enum: ["one", "two"] }));
    it("merges const into existing enum", assertMerges({ enum: [1, 2] }, { const: 3 }, { enum: [1, 2, 3] }));
    it("merges two enums", assertMerges({ enum: [1, 2] }, { enum: [3, 4] }, { enum: [1, 2, 3, 4] }));
    it("dedupes merged enums", assertMerges({ enum: [1, 2] }, { enum: [2, 3] }, { enum: [1, 2, 3] }));
    it(
        "merges types in merged enums",
        assertMerges(
            { const: "one", type: "string" },
            { const: 2, type: "number" },
            { enum: ["one", 2], type: ["string", "number"] }
        )
    );
    it(
        "does not merge enums that share properties",
        assertDoesNotMerge({ const: 1, description: "#1" }, { const: "two", description: "#2" })
    );
    it("does not merge an enum with a non-enum", assertDoesNotMerge({ const: 1 }, { type: "string" }));
});
