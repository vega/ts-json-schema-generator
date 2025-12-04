import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - symbol", assertValidSchema("symbol", "MyObject"));
