import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-exclude", assertValidSchema("type-conditional-exclude", "MyObject"));
