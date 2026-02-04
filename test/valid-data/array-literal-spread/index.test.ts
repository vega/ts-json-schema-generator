import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - array-literal-spread", assertValidSchema("array-literal-spread", "MyType"));
