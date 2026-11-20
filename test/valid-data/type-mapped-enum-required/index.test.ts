import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-enum-required", assertValidSchema("type-mapped-enum-required", "MyObject"));
