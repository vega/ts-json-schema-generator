import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("object-literal-expression", assertValidSchema("object-literal-expression", "MyType"));
