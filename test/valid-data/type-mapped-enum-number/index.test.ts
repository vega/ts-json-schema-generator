import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-enum-number", assertValidSchema("type-mapped-enum-number", "MyObject"));
