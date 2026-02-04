import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-narrowing", assertValidSchema("type-conditional-narrowing", "MyObject"));
