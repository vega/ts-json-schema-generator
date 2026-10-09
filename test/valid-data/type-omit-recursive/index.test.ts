import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-omit-recursive",
    assertValidSchema("type-omit-recursive", ["IFormProps", "SimpleComplexItem", "PickedItem"]),
);
