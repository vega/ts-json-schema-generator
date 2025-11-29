import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-simple", assertValidSchema("type-conditional-simple", "MyObject"));
