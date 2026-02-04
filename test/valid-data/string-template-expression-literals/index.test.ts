import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - string-template-expression-literals",
    assertValidSchema("string-template-expression-literals", "MyObject"),
);
