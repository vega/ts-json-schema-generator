import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-mapped-indexed-access-annotation",
    assertValidSchema("type-mapped-indexed-access-annotation", "Test"),
);
