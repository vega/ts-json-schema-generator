import { test } from "node:test";
import { assertValidSchema } from "../../utils";

const valid = {
    common: "b",
    narrowed: "a",
    reverse: "b",
    numeric: 1,
    numericCommon: 2,
    boolean: true,
    mixed: "a",
    aliased: "b",
    prefixed: { user_name: "Ada", user_age: 30 },
    unprefixed: { name: "Ada", age: 30 },
    capitalized: { getName: "Ada", getAge: 30 },
};

test(
    "valid-data - type-intersection-literal",
    assertValidSchema("type-intersection-literal", "MyObject", undefined, {
        validSamples: [valid, { ...valid, common: "c", narrowed: "b", numeric: 2, mixed: 1 }],
        invalidSamples: [
            ...["a", "d", {}, 1].map((common) => ({ ...valid, common })),
            { ...valid, narrowed: "other" },
            { ...valid, reverse: "other" },
            { ...valid, numeric: 3 },
            { ...valid, numericCommon: 1 },
            { ...valid, boolean: false },
            { ...valid, mixed: "other" },
            { ...valid, mixed: 2 },
            { ...valid, aliased: "a" },
            { ...valid, impossible: "a" },
            { ...valid, mismatched: 1 },
            { ...valid, prefixed: {} },
            { ...valid, unprefixed: {} },
            { ...valid, capitalized: {} },
        ],
    }),
);
