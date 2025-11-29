import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("symbol-union", assertValidSchema("symbol-union", "MyType"));
