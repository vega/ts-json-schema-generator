import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-nested", assertValidSchema("generic-nested", "MyObject"));
