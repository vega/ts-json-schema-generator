import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - object-function-expression", assertValidSchema("object-function-expression", "MyType"));
