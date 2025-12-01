import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-omit", assertValidSchema("type-conditional-omit", "MyObject"));
