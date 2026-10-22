import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-numeric-index-nested-ref",
    assertValidSchema("type-numeric-index-nested-ref", "MyObject", undefined, {
        validSamples: [{ 0: { 0: { a: "x", b: "y" } } }],
        invalidSamples: [{ 0: { 0: { a: "x" } } }, { 0: { 0: { b: "y" } } }, { 0: { 0: { a: "x", b: "y", c: "z" } } }],
    }),
);
