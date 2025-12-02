import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("array-literal-spread", assertValidSchema("array-literal-spread", "MyType"));
