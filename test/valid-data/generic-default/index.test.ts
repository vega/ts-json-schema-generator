import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-default", assertValidSchema("generic-default", "MyObject"));
