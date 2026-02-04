import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - function-generic", assertValidSchema("function-generic", "MyType"));
