import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-omit", assertValidSchema("type-conditional-omit", "MyObject"));
