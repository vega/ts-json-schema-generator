import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-aliases-recursive-generics-anonymous",
    assertValidSchema("type-aliases-recursive-generics-anonymous", "MyAlias"),
);
