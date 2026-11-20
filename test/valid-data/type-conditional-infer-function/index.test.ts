import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-conditional-infer-function",
    assertValidSchema("type-conditional-infer-function", "FuncParams"),
);
