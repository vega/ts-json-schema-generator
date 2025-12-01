import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-symbol", assertValidSchema("type-mapped-symbol", "MyObject"));
