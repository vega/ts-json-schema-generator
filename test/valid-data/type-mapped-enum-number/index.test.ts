import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-enum-number", assertValidSchema("type-mapped-enum-number", "MyObject"));
