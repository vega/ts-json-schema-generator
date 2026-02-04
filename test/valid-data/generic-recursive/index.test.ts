import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-recursive", assertValidSchema("generic-recursive", "MyObject"));
