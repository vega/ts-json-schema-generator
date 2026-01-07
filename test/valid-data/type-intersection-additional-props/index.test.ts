import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-intersection-additional-props",
    assertValidSchema("type-intersection-additional-props", "MyObject"),
);
