import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-primitives", assertValidSchema("type-primitives", "MyObject"));
