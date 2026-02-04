import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - symbol-union", assertValidSchema("symbol-union", "MyType"));
