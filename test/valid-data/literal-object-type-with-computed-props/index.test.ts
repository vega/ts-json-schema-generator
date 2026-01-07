import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - literal-object-type-with-computed-props",
    assertValidSchema("literal-object-type-with-computed-props", "MyType"),
);
