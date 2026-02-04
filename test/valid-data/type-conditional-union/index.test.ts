import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-union", assertValidSchema("type-conditional-union", "MyObject"));
