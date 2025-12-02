import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-nested", assertValidSchema("generic-nested", "MyObject"));
