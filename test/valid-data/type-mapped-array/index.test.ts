import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-array", assertValidSchema("type-mapped-array", "MyObject"));
