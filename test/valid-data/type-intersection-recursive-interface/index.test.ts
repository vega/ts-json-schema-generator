import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-intersection-recursive-interface",
    assertValidSchema("type-intersection-recursive-interface", "Intersection"),
);
