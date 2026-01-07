import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-enum-optional", assertValidSchema("type-mapped-enum-optional", "MyObject"));
