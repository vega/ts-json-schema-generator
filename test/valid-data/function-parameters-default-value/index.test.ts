import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - function-parameters-default-value",
    assertValidSchema("function-parameters-default-value", "myFunction"),
);
