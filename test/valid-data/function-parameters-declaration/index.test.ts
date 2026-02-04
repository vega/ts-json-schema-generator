import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - function-parameters-declaration",
    assertValidSchema("function-parameters-declaration", "myFunction"),
);
