import { assertValidSchema } from "../../utils.js";
import { test } from "node:test";

// The schema.json golden file was generated for the "Headmatter" root type;
// this test previously called assertValidSchema without wrapping it in
// test(), so it never ran and its arguments had drifted from the golden.
test(
    "valid-data - type-mapped-inherit-optional",
    assertValidSchema("type-mapped-inherit-optional", "Headmatter", { additionalProperties: true }),
);
