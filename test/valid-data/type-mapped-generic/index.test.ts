import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-generic", assertValidSchema("type-mapped-generic", "MyObject"));
