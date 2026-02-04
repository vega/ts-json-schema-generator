import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - string-template-expression-literals-import",
    assertValidSchema("string-template-expression-literals-import", "MyObject"),
);
