import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-intersection-partial-conflict-union-alias",
    assertValidSchema("type-intersection-partial-conflict-union-alias", "MyType"),
);
