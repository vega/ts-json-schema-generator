import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-numeric-index-object-intersection",
    assertValidSchema("type-numeric-index-object-intersection", "MyObject", undefined, {
        validSamples: [{ 0: { a: "x", b: "y" } }],
        invalidSamples: [{ 0: { a: "x" } }, { 0: { b: "y" } }, { 0: { a: "x", b: "y", c: "z" } }],
    }),
);
