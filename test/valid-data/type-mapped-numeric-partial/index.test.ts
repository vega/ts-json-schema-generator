import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-mapped-numeric-partial",
    assertValidSchema("type-mapped-numeric-partial", "MyObject", undefined, {
        validSamples: [{}, { 0: "x" }, { 1: 2 }, { 0: "x", 2: 3 }],
        invalidSamples: [{ 0: true }, { a: "x" }, ["x"]],
    }),
);
