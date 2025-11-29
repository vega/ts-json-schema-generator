import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-multiargs", assertValidSchema("generic-multiargs", "MyObject"));
