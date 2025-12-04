import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-enum", assertValidSchema("type-mapped-enum", "MyObject"));
