import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-arrays", assertValidSchema("generic-arrays", "MyObject"));
