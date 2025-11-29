import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-date", assertValidSchema("type-date", "MyObject"));
