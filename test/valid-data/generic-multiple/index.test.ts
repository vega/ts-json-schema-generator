import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-multiple", assertValidSchema("generic-multiple", "MyObject"));
