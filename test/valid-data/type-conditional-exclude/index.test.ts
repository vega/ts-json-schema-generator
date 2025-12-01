import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-exclude", assertValidSchema("type-conditional-exclude", "MyObject"));
