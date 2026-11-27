import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - function-return-generic-recursion",
    assertValidSchema("function-return-generic-recursion", ["MyObject", "MyReturnType"]),
);
