import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-union-keyof", assertValidSchema("type-mapped-union-keyof", "MyObject"));
