import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-void", assertValidSchema("generic-void", "MyObject"));
