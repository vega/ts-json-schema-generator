import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-intersection-nested-properties",
    assertValidSchema("type-intersection-nested-properties", "NestedIntersection", undefined, {
        validSamples: [{ a: { b: "value", c: 1 } }],
        invalidSamples: [{ a: { b: "value" } }, { a: { c: 1 } }, { a: { b: "value", c: 1, extra: true } }],
    }),
);
