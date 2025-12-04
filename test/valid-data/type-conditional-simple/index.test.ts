import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-simple", assertValidSchema("type-conditional-simple", "MyObject"));
