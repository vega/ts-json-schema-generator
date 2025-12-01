import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-intersection", assertValidSchema("type-conditional-intersection", "MyObject"));
