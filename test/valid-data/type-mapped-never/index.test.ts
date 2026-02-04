import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-never", assertValidSchema("type-mapped-never", "MyObject"));
