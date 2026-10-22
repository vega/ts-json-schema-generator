import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-numeric-index-recursive-ref",
    assertValidSchema("type-numeric-index-recursive-ref", "B", undefined, {
        validSamples: [{}, { 0: {} }, { 0: { 0: {} } }],
        invalidSamples: [{ a: 1 }, { 0: { a: 1 } }],
    }),
);
