import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-double-exclude", assertValidSchema("type-mapped-double-exclude", "MyObject"));
