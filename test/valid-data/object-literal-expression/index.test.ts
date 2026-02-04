import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - object-literal-expression", assertValidSchema("object-literal-expression", "MyType"));
