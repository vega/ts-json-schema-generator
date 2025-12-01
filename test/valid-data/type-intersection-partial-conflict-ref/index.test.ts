import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-intersection-partial-conflict-ref",
    assertValidSchema("type-intersection-partial-conflict-ref", "MyType"),
);
