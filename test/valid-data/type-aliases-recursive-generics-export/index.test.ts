import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-aliases-recursive-generics-export",
    assertValidSchema("type-aliases-recursive-generics-export", "MyAlias"),
);
