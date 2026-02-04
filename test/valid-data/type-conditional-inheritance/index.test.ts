import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-inheritance", assertValidSchema("type-conditional-inheritance", "MyObject"));
