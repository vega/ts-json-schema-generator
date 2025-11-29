import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-void", assertValidSchema("generic-void", "MyObject"));
